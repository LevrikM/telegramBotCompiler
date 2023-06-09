import sys
import eel
import json
import os
import io
import subprocess
import pyautogui
from datetime import datetime
from telegram import ReplyKeyboardMarkup, KeyboardButton, InputFile
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters


eel.init('web/bot', allowed_extensions=['.js', '.html', '.css'])

token = sys.argv[1]
print(f"Received token: {token}")

@eel.expose
def save_settings(language, theme, showbtn):
    settings = {'language': language, 'darkMode': theme, 'showBtn' : showbtn}
    with open('settings.json', 'w') as file:
        json.dump(settings, file)

    print(f'Settings saved: [language: {language}, darkMode: {theme}, showBtn: {showbtn}]')

@eel.expose
def get_settings():
    try:
        with open('settings.json', 'r') as file:
            settings = json.load(file)
    except FileNotFoundError:
        settings = {'language': 'en', 'darkMode': False, 'showBtn': True}  # default

    return settings

@eel.expose
def print_to_console(text):
    print(f'BotWindow out: {text}')

##
@eel.expose
def add_button(button_name, button_type, program_name):
    button = {
        "name": button_name,
        "type": button_type,
        "program": program_name if button_type == "openProgram" else "",
        # "folder": folder_path if button_type == "openFolder" else ""
    }

    buttons_folder = "./web/bot/buttons"
    os.makedirs(buttons_folder, exist_ok=True)
    buttons_file = os.path.join(buttons_folder, f"buttons_{token[:5]}.json")

    if os.path.exists(buttons_file):
        with open(buttons_file) as f:
            buttons_data = json.load(f)
    else:
        buttons_data = []

    if any(button["name"] == button_name for button in buttons_data):
        return "exist"


    buttons_data.append(button)

    with open(buttons_file, "w", encoding="utf-8") as f:
        json.dump(buttons_data, f, ensure_ascii=False)

@eel.expose
def get_buttons():
    buttons_folder = "./web/bot/buttons"
    buttons_file = os.path.join(buttons_folder, f"buttons_{token[:5]}.json")

    if os.path.exists(buttons_file):
        with open(buttons_file, encoding="utf-8") as f:
            buttons_data = json.load(f)
    else:
        buttons_data = []

    return buttons_data

@eel.expose
def delete_button(button_name):
    buttons_folder = "./web/bot/buttons"
    buttons_file = os.path.join(buttons_folder, f"buttons_{token[:5]}.json")

    if os.path.exists(buttons_file):
        with open(buttons_file) as f:
            buttons_data = json.load(f)
        
        filtered_buttons = [button for button in buttons_data if button["name"] != button_name]

        with open(buttons_file, "w", encoding="utf-8") as f:
            json.dump(filtered_buttons, f, ensure_ascii=False)
##
@eel.expose
def return_token():
    # print(f'Returned token: {token}')
    return token

def load_buttons_from_file():
    buttons_file = f'./web/bot/buttons/buttons_{token[:5]}.json'
    buttons = []
    with open(buttons_file, 'r') as file:
        buttons_data = json.load(file)
        if isinstance(buttons_data, list):
            buttons = buttons_data
    return buttons



def get_language():
    settings_file = 'settings.json'
    try:
        with open(settings_file, 'r') as file:
            settings = json.load(file)
            return settings.get('language', 'en')
    except FileNotFoundError:
        return 'en'


def get_message_text(key, language):
    with open(f'./web/bot/messages/messages_{language}.json', 'r',  encoding="utf-8") as file:
        messages = json.load(file)
    return messages.get(key, '')

updater = Updater(token, use_context=True)

def start(update, context):
    language = get_language()
    reply_markup = create_menu_buttons()
    message_text = get_message_text('start_message', language)

    update.message.reply_text(message_text, reply_markup=reply_markup)

######
def create_menu_buttons():
    buttons = load_buttons_from_file()
    language = get_language()
    reload_button = KeyboardButton(get_message_text('reload_buttons_btn', language))
    keyboard = [[reload_button]]
    for button in buttons:
        button_name = button['name']
        keyboard.append([KeyboardButton(button_name)])
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    return reply_markup


def open_program(program):
    try:
        subprocess.Popen(program)
        print(f'Open program: {program}')
    except Exception as e:
        print(f'Error open program: {e}')


def reload_buttons():
    return create_menu_buttons()

def button_handler(update, context):
    user_input = update.message.text
    buttons = load_buttons_from_file()
    language = get_language()

    for button in buttons:
        if button['name'] == user_input:
            button_type = button['type']
            if button_type == 'openProgram':
                program_name = button['program']
                open_program(program_name)
                message_text = get_message_text('program_opened_message', language).format(program_name=program_name)
                update.message.reply_text(message_text)
            elif button_type == 'takeScreen':
                screenshot = pyautogui.screenshot()
                screenshot_io = io.BytesIO()
                screenshot.save(screenshot_io, format='PNG')
                screenshot_io.seek(0)
                ##
                now = datetime.now()
                dt_date = now.strftime("%d/%m/%Y")
                dt_time = now.strftime("%H:%M:%S")
                ##
                update.message.reply_text(get_message_text('send_screen', language).format(date=dt_date, time=dt_time))
                update.message.reply_photo(photo=InputFile(screenshot_io, filename='screenshot.png'))
            else:
                message_text = get_message_text('button_selected_message', language).format(button_name=user_input)
                update.message.reply_text(message_text)
            return
    
    if user_input == 'Reload buttons' or user_input == 'Перезавантажити кнопки' or user_input == 'Перезагрузить кнопки':
        reply_markup = reload_buttons()
        message_text = get_message_text('buttons_reloaded_message', language)
        update.message.reply_text(message_text, reply_markup=reply_markup)
    else:
        message_text = get_message_text('unknown_option_message', language)
        update.message.reply_text(message_text)


@eel.expose
def stop_bot():
    try: 
        updater.stop()
        updater.is_idle = False
        return "success"
    except:
        return "error"


@eel.expose
def run_bot():
    try: 
        dispatcher = updater.dispatcher
        start_handler = CommandHandler('start', start)
        dispatcher.add_handler(start_handler)
        dispatcher.add_handler(CommandHandler('reload_buttons', reload_buttons))
        dispatcher.add_handler(MessageHandler(Filters.text, button_handler))
        print(f"Bot start polling at token {token}")
        updater.start_polling()
        return "success"
    except:
        return "error"

eel.start('bot.html', mode="chrome", size=(1300, 600), resizable=False, port=8080)


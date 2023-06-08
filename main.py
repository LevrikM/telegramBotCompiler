import json
import eel

eel.init('web/main', allowed_extensions=['.js', '.html', '.css'])

@eel.expose
def save_token(token):
    saved_tokens = get_saved_tokens()
    if token not in saved_tokens:
        saved_tokens.append(token)
        save_tokens(saved_tokens)
        print(f'Token: {token} saved!')
        return "success"
    else:
        print(f'Token: {token} already exists!')
        return "exists"

def get_saved_tokens():
    try:
        with open('tokens.json', 'r') as file:
            saved_tokens = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        saved_tokens = []
    return saved_tokens

def save_tokens(saved_tokens):
    with open('tokens.json', 'w') as file:
        json.dump(saved_tokens, file)

@eel.expose
def delete_token(token):
    saved_tokens = get_saved_tokens()
    if token in saved_tokens:
        saved_tokens.remove(token)
        save_tokens(saved_tokens)
        print(f'Token: {token} deleted!')
    else:
        print(f'Token: {token} does not exist!')

@eel.expose
def get_saved_tokens_js():
    saved_tokens = get_saved_tokens()
    return saved_tokens

@eel.expose
def save_settings(language, theme):
    settings = {'language': language, 'darkMode': theme}

    with open('settings.json', 'w') as file:
        json.dump(settings, file)

    print(f'Settings saved: [language: {language}, darkMode: {theme}]')

@eel.expose
def get_settings():
    try:
        with open('settings.json', 'r') as file:
            settings = json.load(file)
    except FileNotFoundError:
        settings = {'language': 'en', 'darkMode': False}  # default

    return settings

@eel.expose
def print_to_console(text):
    print(f'Printed from JS: {text}')


import subprocess
import sys
@eel.expose
def run_program(token):
    print(f'Running program on token: {token}')
    subprocess.call(['python', 'bot.py', token])
    eel.expose(sys.exit) 
    sys.exit() 

eel.start('main.html', mode="chrome", size=(1300, 600), resizable=False)

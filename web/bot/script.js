eel.return_token()(function (token) {
    $("#tokenInput").val(token)
});

////////////////////

var translations = {
    en: {
        titleNav: "Bot settings",
        tokenLabel : "Bot token",
        runButton: "Run bot",
        addButton : "Add element",
        placeholderNameInput : "Input button name",
        buttonNameLabel : "Input button name",
        placeholderFolderInput : "Input path to folder",
        folderPathLabel : "Input path to folder",
        placeholderProgramInput : "Input name of program",
        programNameLabel : "Input name of program | If nothing opens, enter the full path to the file (C:\\path\\file)",
        buttonTypeLabel : "Select function of button",
        hideButtonAdd : "Cancel add",
        openProgramOpt : "Open program",
        openFolderOpt : "Open folder",
        takeScreenOpt : "Take screenshot",
        addButtonsOpt : "Add buttons",
        addCommandsOpt : "Add commands",
        addTypeLabel : "Select what to add: ",
        submitButton : "Sumbit",
        buttonListLabel: "List of buttons",
        buttonExist: "Button with the same name already exists",
        runButtonOff : "Stop bot",
        commandNameLabel : "Input command name",
        suffixInputLabel : "Input command suffix",
        commandTypeLabel : "Select action to command",
        stopBotOpt : "Bot stop command",
        restartBotOpt : "Restart bot command",
        getFileOpt : "Send file to chat command",
        filePathLabel : "Input path to file",
    },
    ua: {
        titleNav : "Налаштування бота",
        tokenLabel : "Токен бота",
        runButton: "Запустити бота",
        addButton : "Додати елемент",
        placeholderNameInput : "Введіть назву кнопки",
        buttonNameLabel : "Введіть назву кнопки",
        placeholderFolderInput : "Введіть шлях до папки",
        folderPathLabel : "Введіть шлях до папки",
        placeholderProgramInput : "Введіть назву програми",
        programNameLabel : "Введіть назву програми | Якщо нічого не відкриваєтся, введіть повний шлях до файлу (C:\\path\\file)",
        buttonTypeLabel : "Виберіть функцію кнопки",
        hideButtonAdd : "Відмінити додавання",
        openProgramOpt : "Відкрити програму",
        openFolderOpt : "Відкрити папку",
        takeScreenOpt : "Зробити скріншот",
        addButtonsOpt : "Додати кнопки",
        addCommandsOpt : "Додати команди",
        addTypeLabel : "Оберіть що додати: ",
        submitButton : "Завершити",
        buttonListLabel: "Список кнопок",
        buttonExist: "Кнопка з такою назвою вже існує",
        runButtonOff : "Зупинити бота",
        commandNameLabel : "Введіть назву команди",
        suffixInputLabel : "Введіть суфікс команди",
        commandTypeLabel : "Виберіть дію команди",
        stopBotOpt : "Команда зупинки бота",
        restartBotOpt : "Команда перезапуску бота",
        getFileOpt : "Команда відправлення файлу в чат",
        filePathLabel : "Введіть шлях до файлу",
    },
    ru: {
        titleNav : "Настройки бота",
        tokenLabel : "Токен бота",
        runButton : "Запустить бота",
        addButton: "Добавить элемент",
        placeholderNameInput : "Введите название кнопки",
        buttonNameLabel : "Введите название кнопки",
        placeholderFolderInput : "Введите путь к папке",
        folderPathLabel : "Введите путь к папке",
        placeholderProgramInput : "Введите название программы",
        programNameLabel : "Введите название программы | Если ничего не открывается, то введите полный путь к файлу (C:\\path\\file)",
        buttonTypeLabel : "Выберите функцию кнопки",
        hideButtonAdd : "Отменить добавление",
        openProgramOpt : "Открыть программу",
        openFolderOpt : "Открыть папку",
        takeScreenOpt : "Сделать скриншот",
        addButtonsOpt : "Добавить кнопки",
        addCommandsOpt : "Добавить команды",
        addTypeLabel : "Выберите что добавить: ",
        submitButton : "Завершить",
        buttonListLabel: "Список кнопок",
        buttonExist: "Кнопка с таким названием уже существует",
        runButtonOff: "Остановить бота",
        commandNameLabel : "Введите название команды",
        suffixInputLabel : "Введите суффикс команды",
        commandTypeLabel : "Выберите действие для команды",
        stopBotOpt : "Команда остановки бота",
        restartBotOpt : "Команда перезапуска бота",
        getFileOpt : "Команда отправки файла в чат",
        filePathLabel : "Введите путь к файлу",
    }
};

let selectedLanguage = "";
var darkModeEnabled = "";

var toggleDarkModeButton = $("#toggleDarkModeButton");
var toggleDarkModeIcon = $("#toggleDarkModeIcon");

toggleDarkModeButton.click(function () {
    toggleDarkMode();
});

function updateTexts() {
    var translation = translations[selectedLanguage] || translations.en;

    $("[data-trans]").each(function() {
        var transKey = $(this).data("trans");
        if (translation.hasOwnProperty(transKey)) {
            $(this).text(translation[transKey]);
        }
    });


    // $('#buttonNameInput').attr('placeholder', translation["placeholderNameInput"])
    // $('#programNameInput').attr('placeholder', translation["placeholderProgramInput"])
    // $('#folderPathInput').attr('placeholder', translation["placeholderFolderInput"])

}

function changeLanguage(language){
    selectedLanguage = language;
    eel.save_settings(selectedLanguage, darkModeEnabled)
    updateTexts();
}

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    if (darkModeEnabled) {
        $("body").addClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-adjust").addClass("fa-sun");
        eel.save_settings(selectedLanguage, true)
    } else {
        $("body").removeClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-adjust");
        eel.save_settings(selectedLanguage, false)
    }
}


window.onresize = function () {
    window.resizeTo(1300, 600);
}

$( document ).ready(function() {
    console.log( "ready!" );
    eel.get_settings()(function(settings) {
        selectedLanguage = settings.language
        darkModeEnabled = settings.darkMode;
        eel.print_to_console('BotWindow: darkModeEnabled: ' + darkModeEnabled)


        if (darkModeEnabled) {
            $("body").addClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-adjust").addClass("fa-sun");
            
        } else {
            $("body").removeClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-adjust");
        }
        eel.print_to_console('BotWindow: selectedlanguage: ' + selectedLanguage)
        $("#languageSelect").val(selectedLanguage);
        updateTexts();
    });

    function createButtonElement(buttonData) {
        var buttonElement = $('<li class="list-group-item mb-2"></li>');
        var deleteButton = $('<button class="btn btn-danger btn-sm float-right"> <i class="fas fa-trash-alt"></i></button>');
        var buttonText = $('<span></span>').text(buttonData.name);
        var buttonInfo = $('<span></span>').text(" | " + translations[selectedLanguage][buttonData.type + "Opt"])
        if(buttonData.type == "openProgram"){
            var buttonAppFolder = $('<span></span>').text(" -> " + buttonData.program)
        }
        else if (buttonData.type == "takeScreen"){
            var buttonAppFolder = "";
        }
        else{
            var buttonAppFolder = $('<span></span>').text(" error occured ")
        }
        deleteButton.click(function () {
            eel.delete_button(buttonData.name)();
            buttonElement.remove();
            eel.get_buttons()(function (buttonsData) {
                renderButtons(buttonsData);
            });
        });

        buttonElement.append(deleteButton);
        buttonElement.append(buttonText);
        buttonElement.append(buttonInfo);
        buttonElement.append(buttonAppFolder);
        return buttonElement;
    }

    function renderButtons(buttonsData) {
        var column1 = $('#column1Buttons');
        var column2 = $('#column2Buttons');

        column1.empty();
        column2.empty();

        for (var i = 0; i < buttonsData.length; i++) {
            var buttonData = buttonsData[i];
            var buttonElement = createButtonElement(buttonData);

            if (i % 2 === 0) {
                column1.append(buttonElement);
            } else {
                column2.append(buttonElement);
            }
        }
    }

    eel.get_buttons()(function (buttonsData) {
        renderButtons(buttonsData);
    });

    
    $('#submitButton').click(function () {
        var buttonName = $('#buttonNameInput').val();
        var buttonType = $('#buttonTypeSelect').val();
        var programName = $('#programNameInput').val();
        var folderPath = $('#folderPathInput').val();

        if(buttonName == ""){
            alert (translations[selectedLanguage]["placeholderNameInput"] + "!")
            return;
        }
        if(buttonType == 'openProgram'){
            if(programName == ""){
                alert (translations[selectedLanguage]["placeholderProgramInput"] + "!")
                return;
            }
        }
        else if(buttonType == 'openFolder'){
            if(folderPath == ""){
                alert (translations[selectedLanguage]["placeholderFolderInput"] + "!")
                return;
            }
        }


        eel.add_button(buttonName, buttonType, programName + ".exe", folderPath)(function (result) {
            if(result === "exist"){
                alert(translations[selectedLanguage]["buttonExist"]);
            }
            else{
                eel.get_buttons()(function (buttonsData) {
                    renderButtons(buttonsData);
                });
            }
            
        });

        $('#buttonNameInput').val('');
        $('#buttonTypeSelect').val('openProgram');
        $('#programNameInput').val('');
        $('#folderPathInput').val('');
        toggleButtonForm();
    });


 });



 
function toggleButtonForm() {
    var translation = translations[selectedLanguage]
    var buttonForm = document.getElementById("buttonForm");
    var addButton = document.getElementById("addButton");

    if (buttonForm.style.display === "none") {
        buttonForm.style.display = "block";
        $('#addButton').html(translation["hideButtonAdd"])
    } else {
        buttonForm.style.display = "none";
        $('#addButton').html(translation["addButton"])
    }
}
var buttonsVisible = true;
var toggleButtonsIcon = $("#toggleButtonsIcon");

function toggleButtons() {
    var column1 = $('#column1');
    var column2 = $('#column2');

    if (buttonsVisible) {
        column1.hide();
        column2.hide();
        buttonsVisible = false;
        toggleButtonsIcon.removeClass("fa-sharp fa-solid fa-eye").addClass("fa-solid fa-eye-slash");
    } else {
        column1.show();
        column2.show();
        buttonsVisible = true;
        toggleButtonsIcon.removeClass("fa-solid fa-eye-slash").addClass("fa-sharp fa-solid fa-eye");
    }
}

function toggleAddOptions(){
    var TypeAddSelect = document.getElementById("addTypeSelect");
    var addButtonsOptions = document.getElementById("addButtonsOptions");
    if(TypeAddSelect.value == "addButtons"){
        addButtonsOptions.style.display = "block";
        addCommandsOptions.style.display = "none";

    }else if(TypeAddSelect.value == "addCommands"){
        addButtonsOptions.style.display = "none";
        addCommandsOptions.style.display = "block";
    }
    else{
        addButtonsOptions.style.display = "none";
        addCommandsOptions.style.display = "none";
    }
}

function commandTypeChange(){
    var commandTypeChange = document.getElementById("commandTypeSelect");
    var filePathGroup = document.getElementById("filePathGroup");

    if (commandTypeChange.value === "stopBot") {
        // 
        filePathGroup.style.display = "none"; 
    } else if (commandTypeChange.value === "restartBot") {
        // 
        filePathGroup.style.display = "none"; 
    } else if (commandTypeChange.value === "getFile") {
        // 
        filePathGroup.style.display = "block"; 
    } else {
        //
        filePathGroup.style.display = "none"; 
    }
}

function toggleButtonOptions() {
    var buttonTypeSelect = document.getElementById("buttonTypeSelect");
    var programOptions = document.getElementById("programOptions");
    var folderOptions = document.getElementById("folderOptions");

    if (buttonTypeSelect.value === "openProgram") {
        programOptions.style.display = "block";
        folderOptions.style.display = "none";
    } else if (buttonTypeSelect.value === "takeScreen") {
        programOptions.style.display = "none";
        folderOptions.style.display = "none";
    } else if (buttonTypeSelect.value === "openFolder") {
        programOptions.style.display = "none";
        folderOptions.style.display = "block";
    } else {
        programOptions.style.display = "none";
        folderOptions.style.display = "none";
    }
}



function runProgram(){
    if(eel.run_bot()(function(response){
        if (response === "success") {
            $('#runButton').attr("style", "display:none");
            $('#runButtonOff').attr("style", "display:inline-block");
        }
    }));
}

function stopProgram(){
    if(eel.stop_bot()(function(response){
        if (response === "success") {
            $('#runButtonOff').attr("style", "display:none");
            $('#runButton').attr("style", "display:inline-block");
        }
    }));
}





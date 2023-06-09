function saveToken() {
    var token = document.getElementById("tokenInput").value;
    var errorMessage = document.getElementById("errorMessage");
    if (token.trim() === "") {
        errorMessage.textContent = "Token cannot be empty";
    } else if(token.length < 46){
        errorMessage.textContent = "Token must be 46 characters long"
    }
    else {
        eel.save_token(token)(function (response) {
            if (response === "exists") {
                errorMessage.textContent = "Token already exists";
            } else {
                errorMessage.textContent = "";
                updateTokensList();
            }
        });
    }
}


function deleteToken(token) {
    eel.delete_token(token);
    updateTokensList();
}


function updateTokensList() {
    eel.get_saved_tokens_js()(function(tokens) {
        var tokenList = document.getElementById("tokenList");
        tokenList.innerHTML = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center mb-2";
            listItem.innerHTML = `
                <span>${token}</span>
                <div>
                    <button class="btn btn-sm btn-primary mr-2" onclick="copyToken('${token}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-danger mr-2" onclick="deleteToken('${token}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="runProgram('${token}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>`;
            tokenList.appendChild(listItem);
        }
    });
}


function runProgram(token) {
    eel.run_program(token)();
    window.close()
}

function copyToken(token) {
    var textarea = document.createElement("textarea");
    textarea.value = token;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Token copied to clipboard!");
}

updateTokensList();

////////////////////

var translations = {
    en: {
        titleNav: "Tokens settings",
        title: "Tokens add",
        tokenLabel: "Enter token from BotFather:",
        saveButton: "Save token",
        savedTokens: "Saved Tokens:",
        languageLabel: "Select language:",
        placeholder : "Enter token"
    },
    ua: {
        titleNav : "Налаштування токенів",
        title: "Додавання токенів",
        tokenLabel: "Введіть токен від BotFather:",
        saveButton: "Зберегти токен",
        savedTokens: "Збережені токени:",
        languageLabel: "Оберіть мову:",
        placeholder : "Введіть токен"
    },
    ru: {
        titleNav : "Настройки токенов",
        title: "Добавление токенов",
        tokenLabel: "Введите токен от BotFather:",
        saveButton: "Сохранить токен",
        savedTokens: "Сохраненные токены:",
        languageLabel: "Выберите язык:",
        placeholder : "Введите токен"
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

    $("#tokenInput").attr("placeholder", translation["placeholder"]);
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

window.onload = function() {
    eel.get_settings()(function(settings) {
        selectedLanguage = settings.language
        darkModeEnabled = settings.darkMode;
        eel.print_to_console('language: ' + selectedLanguage)
        eel.print_to_console('darkMode: ' + darkModeEnabled)


        if (darkModeEnabled) {
            $("body").addClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-adjust").addClass("fa-sun");
            
        } else {
            $("body").removeClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-adjust");
        }
        // eel.print_to_console('selectedlanguage2: ' + selectedLanguage)
        $("#languageSelect").val(selectedLanguage);
        updateTexts();
    });

}
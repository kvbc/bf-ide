{
    let themeToClass = new Map();
    themeToClass['terminal'] = 'terminal-theme';
    themeToClass['textmate'] = 'tm';

    ace.themeToClass = function(theme) {
        let _class = themeToClass[theme];
        if(_class) return _class;
        return theme.replace(/_/g, '-');
    }
}
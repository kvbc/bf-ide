const editor = ace.edit('editor');
editor.session.setMode("ace/mode/bf");
editor.setValue("['Hello World' program taken from https://en.wikipedia.org/wiki/Brainfuck]\n\n++++++++                Set Cell 0 to 8\n[\n    >++++               Add 4 to Cell 1; this will always set Cell 1 to 4\n    [                   as the cell will be cleared by the loop\n        >++             Add 2 to Cell 2\n        >+++            Add 3 to Cell 3\n        >+++            Add 3 to Cell 4\n        >+              Add 1 to Cell 5\n        <<<<-           Decrement the loop counter in Cell 1\n    ]                   Loop till Cell 1 is zero; number of iterations is 4\n    >+                  Add 1 to Cell 2\n    >+                  Add 1 to Cell 3\n    >-                  Subtract 1 from Cell 4\n    >>+                 Add 1 to Cell 6\n    [<]                 Move back to the first zero cell you find; this will\n                        be Cell 1 which was cleared by the previous loop\n    <-                  Decrement the loop Counter in Cell 0\n]                       Loop till Cell 0 is zero; number of iterations is 8\n\nThe result of this is:\nCell No :   0   1   2   3   4   5   6\nContents:   0   0  72 104  88  32   8\nPointer :   ^\n\n>>.                     Cell 2 has value 72 which is 'H'\n>---.                   Subtract 3 from Cell 3 to get 101 which is 'e'\n+++++++..+++.           Likewise for 'llo' from Cell 3\n>>.                     Cell 5 is 32 for the space\n<-.                     Subtract 1 from Cell 4 for 87 to give a 'W'\n<.                      Cell 3 was set to 'o' from the end of 'Hello'\n+++.------.--------.    Cell 3 for 'rl' and 'd'\n>>+.                    Add 1 to Cell 5 gives us an exclamation point\n>++.                    And finally a newline from Cell 6\n");
editor.clearSelection();
const Range = require("ace/range").Range;

const src_viewer = ace.edit('src-viewer');
src_viewer.container.style.pointerEvents = "none";
src_viewer.renderer.$cursorLayer.element.style.display = "none";
src_viewer.setOptions({ readOnly: true, maxLines: 1, showGutter: false, showPrintMargin: false });
src_viewer.session.setMode('ace/mode/bf');

const mem_viewer = ace.edit('mem-viewer');
mem_viewer.container.style.pointerEvents = "none";
mem_viewer.renderer.$cursorLayer.element.style.display = "none";
mem_viewer.setOptions({ readOnly: true, showGutter: false, showPrintMargin: false });
mem_viewer.session.setMode('ace/mode/javascript');


const BF_INP = {
    el: {
        editor: $("#editor")[0],
        output: $("#output")[0],
        input:  $("#input")[0],
        sel: {
            theme: $("#theme-sel")[0],
            color: $("#color-sel")[0]
        },
        dbg: {
            mems: $("#dbg-mems")[0],
            dbg_mode: $("#dbg-dbgmode")[0],
            stepby: $("#dbg-stepby")[0],
            eoc: $("#dbg-eoc")[0],
            ip: $("#dbg-ip")[0],
            mp: $("#dbg-mp")[0],
            memp: $("#dbg-memp")[0]
        }
    },
    dbg_mode: false,
    utils: {},

    audio: {
        press: new Audio('sfx/press.mp3'),
        small_press: new Audio('sfx/small_press.mp3')
    },

    button: {
        setState: (id, disabled, color) => {
            document.getElementById(id).disabled = disabled;
            $(`#${id}`).css({ 'border-color':color, 'color':color });
        },
        disable: (id) => { BF_INP.button.setState(id, true,  'silver');       },
        enable:  (id) => { BF_INP.button.setState(id, false, 'var(--color)'); }
    },

    debugger: {
        dbg: null,
        start: () => {
            BF_INP.audio.press.play();
            (BF_INP.debugger.dbg = new Debugger()).start();
        },
        stop: () => {
            BF_INP.audio.press.play();
            BF_INP.debugger.dbg.stop();
        },
        run: () => {
            BF_INP.audio.press.play();
            BF_INP.debugger.dbg.run();
        },
        step: () => {
            BF_INP.audio.press.play();
            BF_INP.debugger.dbg.step();
        }
    },

    update: {
        theme: () => {
            let thsel = BF_INP.el.sel.theme;
            let theme = thsel.options[thsel.selectedIndex].value;
            editor.setTheme(`ace/theme/${theme}`);
            src_viewer.setTheme(`ace/theme/${theme}`);
            mem_viewer.setTheme(`ace/theme/${theme}`);
            theme = ace.themeToClass(theme);
            [BF_INP.el.sel.theme, BF_INP.el.sel.color, BF_INP.el.dbg.mems, BF_INP.el.dbg.stepby, BF_INP.el.input, BF_INP.el.output, document.body]
            .forEach(e => { e.className = `ace-${theme}` });
        },
        color: () => {
            BF_INP.audio.small_press.play()
            let clrsel = BF_INP.el.sel.color;
            document.documentElement.style.setProperty('--color', clrsel.options[clrsel.selectedIndex].value);
        }
    },

    get: {
        mems: () => {
            return Math.clamp(Number(BF_INP.el.dbg.mems.value), 10, 30000);
        }
    },

    run: () => {
        BF_INP.audio.press.play();
        let inp = new Interpreter(BF_INP.get.mems());
        inp.init();
        inp.run();
    },

    beautify: () => {
        BF_INP.audio.press.play();
        let ntxt = '';
        let txt = editor.getValue().BF();
        for(let i = 0, b = 0; i < txt.length; i++)
            if(txt[i] == '[')        ntxt += `\n${'\t'.repeat(b++)}[\n${'\t'.repeat(b)}`;
            else if(txt[i] == ']')   ntxt += `\n${'\t'.repeat(--b)}]\n${'\t'.repeat(b)}`;
            else if(txt[i] == '\n')  ntxt += `\n${'\t'.repeat(b)}`;
            else if(txt[i] == '.' && BF_INP.utils.is_slloop(txt, i)) ntxt += `.\n${'\t'.repeat(b)}`;
            else if(txt[i] == ',' && BF_INP.utils.is_slloop(txt, i)) ntxt += `,\n${'\t'.repeat(b)}`;
            else                     ntxt += txt[i];
        editor.setValue(ntxt.replace(/\[\n(\t+)?([^[\]]+)\n(\t+)?\]/g, '[$2]'));
        editor.clearSelection();
    },

    clear: e => {
        BF_INP.audio.press.play();
        if(e == editor) editor.setValue('');
        else            e.value = '';
    },
};


$(window).on('beforeunload', function() { return ''; });
$(document).ready(() => {
    BF_INP.update.theme();
    BF_INP.button.disable('dbg-stop');
    BF_INP.button.disable('dbg-run');
    BF_INP.button.disable('dbg-step');
});

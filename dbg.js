function Debugger() {
    this.inp = new Interpreter(BF_INP.get.cells());
    this.inp.init();
}


Debugger.prototype.start = function() {
    BF_INP.button.disable('dbg-start');
    BF_INP.button.enable('dbg-stop');
    BF_INP.button.enable('dbg-run');
    BF_INP.button.enable('dbg-step');
    src_viewer.setValue(editor.getValue().BF());
    src_viewer.clearSelection();
    src_viewer.selection.setRange(new Range(0, 0, 0, 1));
    this.update.mem(this.inp.data());
    BF_INP.el.dbg.memp.style.display = 'inline';
}


Debugger.prototype.stop = function() {
    BF_INP.button.enable('dbg-start');
    BF_INP.button.disable('dbg-stop');
    BF_INP.button.disable('dbg-run');
    BF_INP.button.disable('dbg-step');
    src_viewer.setValue('Source View'); src_viewer.clearSelection();
    mem_viewer.setValue('Memory View'); mem_viewer.clearSelection();
    BF_INP.el.dbg.memp.style.display = 'none';
    BF_INP.el.dbg.eoc.style.display = 'none';
}


Debugger.prototype.run = function() {
    let data;
    if(BF_INP.dbg_mode) {
        while (
            (data = this.inp.data()).ip < data.code.length &&
            data.code[data.ip] != '#'
        ) this.inp.step();
        this.inp.skip();
    }
    else this.inp.run();
    BF_INP.el.dbg.eoc.style.display = 'inline';

    data = this.inp.data();
    this.update.mem(data);
    this.update.src_pointer(data);
    BF_INP.el.dbg.ip.innerHtml = `ip: ${data.ip}`;
    BF_INP.el.dbg.mp.innerHtml = `mp: ${data.mp}`;
}


Debugger.prototype.step = function() {
    if(this.inp.eoc()) {
        BF_INP.el.dbg.eoc.style.display = 'inline';
        return;
    }

    let data, by = Math.max(Number(BF_INP.el.dbg.stepby.value), 1);
    while (
        by-- && 
        (data = this.inp.data()).ip < data.code.length
    ) this.inp.step();
    
    data = this.inp.data();
    this.update.mem(data);
    this.update.src_pointer(data);
    BF_INP.el.dbg.ip.innerHtml = `ip: ${data.ip}`;
    BF_INP.el.dbg.mp.innerHtml = `mp: ${data.mp}`;
}


Debugger.prototype.update = {
    mem: (data) => {
        let mem       = data.stack.prev(5, data.mp).add(data.mp.pad(5)).add(data.stack.next(5, data.mp));
        let mem_val   = mem.map    (ip  => { return data.stack[Number(ip)].center(5);                            });
        let ascii_val = mem_val.map(val => { return String.fromCharCode(Number(val)).replaceSpecial().center(5); });
        mem_viewer.setValue(`${ascii_val.join('  ')}\n${mem_val.join('  ')}\n${mem.join('  ')}`);
        mem_viewer.clearSelection();
    },
    src_pointer: (data) => {
        src_viewer.renderer.scrollCursorIntoView({ row:0, column:data.ip }, 0.5);
        src_viewer.selection.setRange(new Range(0, data.ip, 0, data.ip + 1));
    }
};

class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        cp.on('.back', DOMAIN, 'click', t => this.back());
        cp.on('.save', DOMAIN, 'click', t => this.save());
    }

    INIT() {
        //this.initList();
    }

    back() {
        cp.link('/content')
    }

    save() {
        console.log(this.APP.scene);
    }

    showStory() {
        cp.show(this.addContentDom);
    }
}
class ContextDispatcher {
  constructor() {
    this.pages = new Map();
  }

  assemblePageAndContext = (pageID, contextID) => {
    if (!this.pages.has(pageID)) {
      this.pages.set(pageID, new Map());
    }
    const page = this.pages.get(pageID);
    if (!page.has(contextID)) {
      page.set(contextID, {executors: []});
    }
  }

  addListener = (pageID, contextID, executor) => {
    if (!pageID || !contextID || !executor) {
      return;
    }
    this.assemblePageAndContext(pageID, contextID);
    const page = this.pages.get(pageID);  
    const executors = page.get(contextID).executors;
    executors.push(executor);

    return () => {
      const index = executors.indexOf(executor);
      if (index >= 0) {
        executors.splice(index, 1);
      }
      // delete table
      if (executors.length === 0) {
        page.delete(contextID);
      }
      if (page.size === 0) {
        this.pages.delete(pageID);
      }
    };
  };

  notify = (pageID, contextID, value) => {
    if (!pageID || !contextID) {
      return;
    }
    this.assemblePageAndContext(pageID, contextID);
    const page = this.pages.get(pageID);
    const ctx = page.get(contextID);
    ctx.currentValue = value;
    ctx.executors.forEach((listener) => {
      listener(value);
    });
  }

  getContextValue = (pageID, contextID) => {
    const page = this.pages.get(pageID);
    if (!page) return undefined;
    const ctx = page.get(contextID);
    if (!ctx) return undefined;
    return ctx?.currentValue;
  }
}

const ContextDispatcherInstance = new ContextDispatcher();

export default ContextDispatcherInstance

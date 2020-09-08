import Commands from './listCommands';

const ListResponderMixin = {
    scrollResponderReloadData: function(data, priority) {
        const that = this;
        if (!that.getNativeScrollRef) {
            console.warn('Expected getNativeScrollRef to be called on a VitualizedList');
            return;
        }
        const nativeScrollRef = that.getNativeScrollRef();
        if (nativeScrollRef === null) {
            return;
        }
        Commands.reloadData(nativeScrollRef, data, priority);
    },
    scrollResponderUpdateData: function(data, diff, priority) {
        const that = this;
        if (!that.getNativeScrollRef) {
            console.warn('Expected getNativeScrollRef to be called on a VitualizedList');
            return;
        }
        const nativeScrollRef = that.getNativeScrollRef();
        if (nativeScrollRef === null) {
            return;
        }
        Commands.performUpdate(nativeScrollRef, data, diff, priority);
    },
}

const ListResponder = {
    Mixin: ListResponderMixin,
}

export default ListResponder;
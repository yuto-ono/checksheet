ons.bootstrap().service('CentralService', function() {
    this.item = {};
    this.items = [];
    this.index = 0;
    this.url = '';
    this.db = new Dexie('AppDB');
    
    this.db.version(1).stores({ data: '++id' });
    
    this.save = () => this.db.data.put(this.item);
    this.remove = () => this.db.data.delete(this.item.id);
})

.controller('HomeController', function($scope, $timeout, CentralService) {
    var self = this;
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = () => {
        this.store.item = {
            positions: [],
            blob: input.files[0]
        };
        
        this.store.db.data.put(this.store.item).then(id => {
            $timeout(() => {
                this.store.item.id = id;
                this.store.index = this.store.items.length;
                this.store.url = URL.createObjectURL(this.store.item.blob);
                this.store.items.push(this.store.item);
                $scope.navi.pushPage('edit.html');
            });
        });
    };
    
    this.store = CentralService;
    
    this.getPicture = () => {
        input.click();
    };
    
    this.loadPicture = index => {
        this.store.item = this.store.items[index];
        this.store.index = index;
        this.store.url = URL.createObjectURL(this.store.item.blob);
        $scope.navi.pushPage('edit.html');
    };
})

.controller('EditController', function($scope, $timeout, CentralService) {
    this.store = CentralService;
    
    this.put = e => {
        this.store.positions.push({
            top: e.layerY - 15,
            left: e.layerX - 15
        });
        this.store.save();
    };
    
    this.remove = (e, index) => {
        e.stopPropagation();
        this.store.positions.splice(index, 1);
        this.store.save();
    };
    
    this.destroy = () => {
        ons.notification.confirm({
            title: '確認',
            message: '削除してもよろしいですか？',
            buttonLabels: ['削除', 'キャンセル'],
            primaryButtonIndex: 0,
            cancelable: true,
            callback: index => {
                if (!index) {
                    $timeout(() => {
                        this.store.remove();
                        this.store.data.splice(this.store.index, 1);
                        $scope.navi.popPage();
                    });
                }
            }
        });
    };
});

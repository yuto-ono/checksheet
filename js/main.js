ons.bootstrap().service('CentralService', function() {
    this.uri = '';
    this.positions = [];
    this.pictures = [];
    this.db = new Dexie('AppDB');
    
    this.db.version(1).stores({
        pictures: '++id',
        data: 'id'
    });
    
    this.db.data.get(1).then(data => {
        this.pictures = data.data;
    });
    
    
    this.save = () => {
        this.db.data.put({ id: 1, data: pictures });
    };
})

.controller('HomeController', function($scope, $timeout, CentralService) {
    var self = this;
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'
    
    input.onchange = () => {
        this.data.db.pictures.put({ blob: input.files[0] }).then(id => {
            $timeout(() => {
                this.data.uri = URL.createObjectURL(input.files[0]);
                this.data.positions = [];
                this.data.index = this.data.pictures.length;
                this.data.pictures.push({
                    picture_id: id,
                    positions: this.data.positions
                });
                this.data.save();
                $scope.navi.pushPage('edit.html');
            });
        });
    };
    
    this.data = CentralService;
    
    this.getPicture = () => {
        input.click();
    };
    
    this.loadPicture = index => {
        var picture_id = this.data.pictures[index].picture_id;
        this.data.db.pictures.get(picture_id).then(picture => {
            $timeout(() => {
                this.data.uri = URL.createObjectURL(picture.blob);
                this.data.positions = this.data.pictures[index].positions;
                this.data.index = index;
                $scope.navi.pushPage('edit.html');
            });
        });
    };
})

.controller('EditController', function($scope, $timeout, CentralService) {
    this.data = CentralService;
    
    this.put = e => {
        this.data.positions.push({
            top: e.layerY - 15,
            left: e.layerX - 15
        });
        this.data.save();
    };
    
    this.remove = (e, index) => {
        e.stopPropagation();
        this.data.positions.splice(index, 1);
        this.data.save();
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
                    this.data.pictures.splice(this.data.index, 1);
                    this.data.save();
                    $scope.navi.popPage();
                }
            }
        });
    };
});

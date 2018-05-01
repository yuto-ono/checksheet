ons.bootstrap().factory('SharedStateService', function() {
    return {
        uri: '',
        index: 0,
        positions: [],
        pictures: []
    };
})

.controller('HomeController', function($scope, $timeout, SharedStateService) {
    var self = this;
    var input = document.createElement('input');
    input.type = 'file';
    
    input.onchange = () => {
        var fr = new FileReader();
        
        fr.onload = () => {
            $timeout(() => {
                this.data.uri = fr.result;
                this.data.positions = [];
                this.data.index = this.data.pictures.length;
                this.data.pictures.push({
                    uri: fr.result,
                    positions: this.data.positions
                });
                $scope.navi.pushPage('edit.html');
            });
        };
        
        fr.readAsDataURL(input.files[0]);
    };
    
    this.data = SharedStateService;
    
    try {
        var data = localStorage.getItem('data');
        if (data) {
            this.data.pictures = JSON.parse(data);
        }
    }
    finally {}
    
    this.getPicture = () => {
        input.click();
    };
    
    this.loadPicture = index => {
        this.data.uri = this.data.pictures[index].uri;
        this.data.positions = this.data.pictures[index].positions;
        this.data.index = index;
        $scope.navi.pushPage('edit.html');
    };
})

.controller('EditController', function($scope, $timeout, SharedStateService) {
    this.data = SharedStateService;
    
    this.put = e => {
        this.data.positions.push({
            top: (e.layerY - 15) + 'px',
            left: (e.layerX - 15) + 'px'
        });
        this.save();
    };
    
    this.remove = (e, index) => {
        e.stopPropagation();
        this.data.positions.splice(index, 1);
        this.save();
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
                    this.save();
                    $scope.navi.popPage();
                }
            }
        });
    };
    
    this.save = () => {
        localStorage.setItem('data', JSON.stringify(this.data.pictures));
    };
});

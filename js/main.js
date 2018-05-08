ons.bootstrap().service('CentralService', function() {
  this.item = {};
  this.items = [];
  this.index = 0;
  this.db = new Dexie('AppDB');

  this.db.version(1).stores({ data: '++id' });

  this.save = () => this.db.data.put({
    id: this.item.id,
    positions: this.item.positions,
    buffer: this.item.buffer,
    type: this.item.type
  });
  
  this.remove = () => this.db.data.delete(this.item.id);
})

.controller('HomeController', function($scope, $timeout, CentralService) {
  var self = this;
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = () => {
    var fr = new FileReader();
    
    fr.onload = () => {
      this.store.item = {
        positions: [],
        buffer: fr.result,
        type: input.files[0].type,
        url: URL.createObjectURL(input.files[0])
      };

      this.store.db.data.add(this.store.item).then(id => {
        $timeout(() => {
          this.store.item.id = id;
          this.store.index = this.store.items.length;
          this.store.items.push(this.store.item);
          $scope.navi.pushPage('edit.html');
        });
      });
    };
    
    fr.readAsArrayBuffer(input.files[0]);
  };

  this.store = CentralService;
  
  this.store.db.data.toArray().then(data => {
    $timeout(() => {
      data.forEach(item => {
        var blob = new Blob([ item.buffer ], { type: item.type });
        
        this.store.items.push({
          id: item.id,
          positions: item.positions,
          buffer: item.buffer,
          type: item.type,
          url: URL.createObjectURL(blob)
        });
      });
    });
  });
  

  this.getPicture = () => {
    input.click();
  };

  this.loadPicture = index => {
    this.store.item = this.store.items[index];
    this.store.index = index;
    $scope.navi.pushPage('edit.html');
  };
})

.controller('EditController', function($scope, $timeout, CentralService) {
  this.store = CentralService;

  this.put = e => {
    this.store.item.positions.push({
      top: e.layerY - 15,
      left: e.layerX - 15
    });
    this.store.save();
  };

  this.remove = (e, index) => {
    e.stopPropagation();
    this.store.item.positions.splice(index, 1);
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
            this.store.items.splice(this.store.index, 1);
            $scope.navi.popPage();
          });
        }
      }
    });
  };
});

if ('serviceworker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

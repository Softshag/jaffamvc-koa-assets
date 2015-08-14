'use strict'

console.log(Assets)

var button = new Assets.UploadButton({
  autoUpload: true,
  url: '/files',
  maxSize: 1024*1000,
  //mimeType: 'image/*'
});


var collection = new Assets.AssetsCollection(null,{
  url: '/files'
});

button.on('upload', function (asset) {
  collection.add(asset)
})

collection.fetch().then(function () {
  console.log('done', collection)
})

var view = new Assets.AssetsListView({
  collection: collection
});

view.on('selected', function (view, model) {
  console.log('selected', model.toJSON())
})


var preview = new Assets.AssetsPreview();




var container = document.getElementById("container")
container.appendChild(button.render().el)
container.appendChild(view.render().el)
container.appendChild(preview.render().el);
//console.log(button.el)
//button.render().appendTo(container)

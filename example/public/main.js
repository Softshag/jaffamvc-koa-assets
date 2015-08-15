'use strict'



var button = new Assets.UploadButton({
  autoUpload: true,
  url: '/files',
  maxSize: 1024*1000,
  //mimeType: 'image/*'
});


var collection = new Assets.AssetsCollection(null,{
  url: '/files'
});

collection.fetch().then(function () {
  console.log('done', collection)
})


button.on('upload', function (asset) {
  collection.add(asset)
})



var view = new Assets.AssetsListView({
  collection: collection
});

var preview = new Assets.AssetsPreview();


view.on('selected', function (view, model) {
  //console.log('selected', model.toJSON())
  preview.model = model
})






var container = document.getElementById("container")

container.appendChild(button.render().el)
document.querySelector('.gallery-list').appendChild(view.render().el)
document.querySelector('.gallery-preview').appendChild(preview.render().el);
//console.log(button.el)
//button.render().appendTo(container)

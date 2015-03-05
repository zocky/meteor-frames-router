Template.Frame.helpers({
})

Template.Frame.created = function() {
  this.data.context = FramesRouter.loadContext(this.data.path);
}

Template.Frame.destroyed = function() {
  FramesRouter.unloadContext(this.data.path);
}


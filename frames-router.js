FramesRouter = {
  routes: [],
  addRoute: function(path,opt) {
    var route = new FramesRoute(path,opt);
    //TODO: prevent duplication and ambiguity
    this.routes.push(route);
  },
  addRoutes: function(obj) {
    for (var i in obj) this.addRoute(i,obj[i]);
  },
  getContext: function(path) {

  },
  loadContext: function(path) {
    var parsed = this.parse(path);
    assert (parsed,'bad path');
    parsed.parentPath && this.loadContext(parsed.parentPath);
    var ctx = FramesContext.load(parsed.path,parsed.parentPath,parsed.route);
    ctx.path = parsed.path;
    ctx.route = parsed.route;
    ctx.params = parsed.params;
    return ctx;
  },
  unloadContext: function(path) {
    FramesContext.unload(path);
  },
  parse: function(path) {
    var found = null;
    var res = _.map(this.routes,function(r){
      var ret = r.parse(path);
      if(!ret) return false;
      assert(!(found && ret.found), 'ambiguous path');
      found = found || ret.found;
      return ret;
    })
    .filter(Boolean)
    .sort(function(a,b){
      return a.depth - b.depth
    });
    if (!found) return null;
    
    found = res.pop();
    var parent = res.pop();
    
    return {
      route: found.route,
      path: found.path,
      params: found.params,
      parentPath: parent && parent.path
    }
  },
}

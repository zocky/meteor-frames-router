FramesRoute = function(path, opt) {
  if (!opt) opt = path, path = opt.path;
  else opt.path = path;
  assert (opt.path,'no path');
  
  this.path = cleanPath(opt.path);
  this.parser = makePathParser(opt.path);
  this.meta = {
    title: opt.title,
    icon: opt.icon,
    label: opt.label,
    display: opt.display,
    color: opt.color,
    content: opt.content,  
    template: opt.template,  
  }
  this.data = opt.data || {};
  this.create = opt.create;
  this.setup = opt.setup;
  this.destroy = opt.destroy;
}
_.extend(FramesRoute.prototype,{

  parse: function(str) {
    var parsed = this.parser.parse(str);
    if (!parsed) return null;
    parsed.route = this;
    return parsed;
  },
})



function makePathParser(pattern) {
  var re = /(^\/+|\/+$)|(\/+)|:([\w$]+)\.\.\.\/?$|:([\w$]+)(?=(?:\/|$))|([^: ][^\/ ]*)|(.)/g;
  var names = [];
  var depth = 0;
  try {
    var ret = pattern.replace(re,function(m,m1,m2,m3,m4,m5,m6,m7){ 
      if (m3 || m4) names.push(m3 || m4);
      if (m3 || m4 || m5) depth++;
      if (m1) { // (^\/+|\/+$) 
        // remove leading / trailing slashes
        return '';  
      } 
      if (m2) { // (\/+)
        // collapse repeating slashes
        return '/+'; 
      }
      if (m3) { //[:]([\w$]+)\.\.\.\/*$
        // match a final path argument, ignore final slash
        return '(.*)/?$'; 
      }
      if (m4) { //[:]([\w$]+)
        return '([^/]+)'; 
      }
      if (m5) return m5.replace(/[\W]/g,'\\$&'); //([^:][^\/]*)|
      if (m6) throw ('bad pattern'); //(.)
    });
    var re2 = new RegExp('^/*'+ret+'(?=/|$)');
    return {
      re: re2,
      depth: depth,
      names: names,
      parse: function (str) {
        var m = str.match(this.re);
        if(!m) return null;
        var found = m.shift();
        var path = cleanPath(found);
        var params = {};
        this.names.forEach(function(n){
          params[n] = m.shift();
        });
        return {
          depth: this.depth,
          params: params,
          path: path,
          found: found == str
        }
      }
    };
  } catch (e) {
    return null;
  }
}

function cleanPath(path) {
/*
  remove spaces, as well as leading, trailing and duplicate slashes
*/
  return path.trim().replace(/\s/g,'').split('/').filter(Boolean).join('/');
}


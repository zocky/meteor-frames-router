EXPERIMENTAL and not production ready. You have been warned.

# FramesRouter - Routable subpages for Meteor

With FramesRouter, you can define routes and show them in templates with `{{>Frame path="/your/path"}}`.

When a route is loaded, it will first wait for all its parent routes to load before calling any of its subscriptions or evaluating any of its data. 
The data calculated in the parent routes will be inherited by descendant routes. 

When data for a particular path is needed (e.g. when it or any of its descendants are called with `{{>Frame}}`), a reactive context will be loaded 
and associated with the path. If the same path is used again by other parts of your page, the context will be reused.

When a context is no longer required, i.e. when all instances of `{{>Frame}}` that use the context hae been destroyed), it will be destroyed. Its
subscriptions will be stopped and its data will no longer will be available.

## Installation
`meteor add zocky:frames-router`

## API
### `FramesRouter.addRoute(path,options)`
Route paths can contain params, which are prefixed with `:` and available in your callbacks under `this.params`. The final parameter can end with `...`, meaning that it accepts slashes. 

`options` is an object that can include: 

- `setup`
A function that will be run when all parent routes are loaded. `this` refers to the context. Useful functions at this point include:
* `this.subscribe( name, args... )` - A wrapper for `Meteor.subscribe` which will ensure that the router will wait for the subscription, and that the subscription is stopped when it's no longer required.
* `this.wait()` - Call this before an async task that the router should wait for.
* `this.done()` - Call this when your async task is done. 

- `data`
An object of values or functions that will be included in your context. If functions use any reactive data, they will be reactive.
Parent data will be inherited by descendants, and can be used for calculating data in the descendants.

- `template`
The name of the template that will display your data.  

### `FramesRouter.addRoutes(routeMap)`
Calls `FramesRouter.addRoute` for each route in the map, with keys used as `path` and values as `options`.

### `{{>Frame path="/your/path"}}`
Include your routes in templates.

## Example
In javascript on client:

    FramesRouter.addRoutes({
      '/projects': {
        setup: function() {
          this.subscribe('projects');
        },
        data: {
          projects: function() {
            return Projects.find();
          }
        },
        template: 'projects'
      },
      '/projects/:project': {
        data: {
          project: function() {
            return Projects.findOne(this.params.project);
          }
        },
        template: 'project'
      },
      '/projects/:project/files': {
        data: {
          files: function() {
            return Files.find({project:this.params.project});
          },
          title: function() {
            return 'Files for project '+this.data.project.name;
          }
        },
        template: 'files'
      },
    })
    
In HTML on client:
    
    {{>Frames path="/projects/test1/files"}}
    
## TODO:
* Query params
* Better docs
* Stop reactives on destroy, maybe delete everything in .data

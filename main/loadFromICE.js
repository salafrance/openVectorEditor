var ReactDOM = require('react-dom');
var App = require('../app/App.js');
import request from 'superagent/lib/client';
import {toOpenVectorEditor} from '../app/schemaConvert';

var id;
    if(window.frameElement) { // we are embedded and referrer might be bad
        id = window.frameElement.id; // grab the entry ID off the iframe tag
    } else {
        id = document.referrer; // this works weird in firefox but always works fullscreen
        id = id.replace(/.+entry\//, "");
    }
var cookie = document.cookie;
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
    sid = sid.replace(/sessionId=|%22/g, ""); // trim quotation marks

var ORIGIN = document.location.origin // this works fine on embedded because the origin's the same
console.log(ORIGIN + '/rest/parts/' + id + '/sequence')

// async response call
request
    .get(ORIGIN + '/rest/parts/' + id + '/sequence')
    .set('X-ICE-Authentication-sessionId', sid)
    .accept('application/json')
    .end(function(err, result) {
        var contents = result.body;
        if (!contents) {
          // add some empty data
          contents = {
              canEdit: false,
              features: [],
              identifier: "",
              name: "new sequence",
              isCircular: false,
              length: 0,
              sequence: ""
          }
        }

        //Editor is the React Component
        //controller is the cerebral state controller
        var { Editor, controller } = App(toOpenVectorEditor(contents, { request: request }));
        //choose the dom node you want to render to
        const DOMNodeToRenderTo = document.createElement('div');
        document.body.appendChild(DOMNodeToRenderTo);
        ReactDOM.render(Editor, DOMNodeToRenderTo);
    }
);

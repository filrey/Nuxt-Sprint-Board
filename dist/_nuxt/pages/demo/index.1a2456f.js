(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{460:function(t,e,o){"use strict";o.r(e);o(30);var n=o(42),l={data:function(){return{caption:"",img1:"",imageData:null}},methods:{create:function(){var t={photo:this.img1,caption:this.caption};n.a.database().ref("PhotoGallery").push(t).then((function(t){console.log(t)})).catch((function(t){console.log(t)}))},click1:function(){this.$refs.input1.click()},previewImage:function(t){this.uploadValue=0,this.img1=null,this.imageData=t.target.files[0],this.onUpload()},onUpload:function(){var t=this;this.img1=null;var e=n.a.storage().ref("".concat(this.imageData.name)).put(this.imageData);e.on("state_changed",(function(e){t.uploadValue=e.bytesTransferred/e.totalBytes*100}),(function(t){console.log(t.message)}),(function(){t.uploadValue=100,e.snapshot.ref.getDownloadURL().then((function(e){t.img1=e,console.log(t.img1)}))}))}}},c=o(72),r=o(95),f=o.n(r),v=o(332),h=o(346),d=(o(163),o(166)),m=Object(d.a)("flex"),w=Object(d.a)("layout"),x=o(398),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-container",[o("v-layout",{attrs:{row:""}},[o("v-flex",{staticClass:"text-center font-weight-black"},[o("h1",[t._v("Upload a photo")])])],1),t._v(" "),o("v-layout",{attrs:{row:""}},[o("v-flex",{attrs:{md6:"","offset-sm3":""}},[o("div",[o("div",[o("v-btn",{on:{click:t.click1}},[t._v("choose photo")]),t._v(" "),o("input",{ref:"input1",staticStyle:{display:"none"},attrs:{type:"file",accept:"image/*"},on:{change:t.previewImage}})],1),t._v(" "),null!=t.imageData?o("div",[o("img",{staticClass:"preview",attrs:{height:"268",width:"356",src:t.img1}}),t._v(" "),o("br")]):t._e()])])],1),t._v(" "),o("v-layout",{attrs:{row:""}},[o("v-flex",{staticClass:"text-center",attrs:{md6:"","offset-sm3":""}},[o("v-text-field",{attrs:{solo:"",label:"Caption goes here"},model:{value:t.caption,callback:function(e){t.caption=e},expression:"caption"}})],1)],1),t._v(" "),o("v-layout",{attrs:{row:""}},[o("v-flex",{staticClass:"text-center"},[o("v-btn",{attrs:{color:"pink"},on:{click:t.create}},[t._v("upload")])],1)],1)],1)}),[],!1,null,null,null);e.default=component.exports;f()(component,{VBtn:v.a,VContainer:h.a,VFlex:m,VLayout:w,VTextField:x.a})}}]);
import { Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ImagesComponent } from '../images/images.component'


@Component({
  selector: 'app-anymoreimag',
  templateUrl: './anymoreimag.component.html',
  styleUrls: ['./anymoreimag.component.scss']
})
export class AnymoreimagComponent implements OnInit {

  // this needs to be changed based on the backend question_id
  questionId : any = "065af52b6c0c07cc26771f6534b6b5e0"
  show: any

  request : any
  imageRequest : any
  requestData : any
  db : any
  vendorStore : any  
  cursor : any
  offlineFormData : any = new Array()
  transaction : any

  @ViewChild('parent', {
    read: ViewContainerRef
  }) container: ViewContainerRef

  constructor(private _cfr: ComponentFactoryResolver, ) {}

  ngOnInit() {
    this.show = localStorage.getItem("form_status")
    if(navigator.onLine) {
      this.preFilledData()
    } else {
      if(window.indexedDB){
        this.request = window.indexedDB.open("offlineForms", 1)
        // console.log(this.request)
        this.request.onerror = ( event : any ) => {
          console.error("error while getting offlineforms in anymoreimages")
          // this.ProjectService.openErrMsgBar("We could not save your data.", "OFFLINE!", 8000)
        }
        this.request.onsuccess = (event:any)=>{
          this.db = this.request.result
          this.transaction = this.db.transaction(["vendorStore"])
          // console.log("%c this.transaction is ", "color:#800", this.transaction)

          this.vendorStore = this.transaction.objectStore("vendorStore")
          // console.log("%c this.vendorStore is ", "color:#880", this.vendorStore)

          this.imageRequest = this.vendorStore.get(this.questionId)
          // console.log("%c this.request is ", "color:#808", this.imageRequest)

          this.imageRequest.onerror = (event : any) => {
            console.error("Image corresponding to question id could not be fetched successfully ", event)
          }
          this.imageRequest.onsuccess = (event : any) => {
            let x = event.target.result.data
            this.offlinePreFilledData(x)          
          }
        }
        this.request.onupgradeneeded = (event:any) => {
          this.db = event.target.result
          this.vendorStore =  this.db.createObjectStore("vendorStore", { keyPath:"question_id" })
          // for ( var i in this.emp ) {
          //     this.objectStore.add(this.emp[i])
          // }
        }
      }
    }
  }

  addComponent(questionId, dataId, src){
    // Check and resolve the component
    var comp = this._cfr.resolveComponentFactory(ImagesComponent);
    // Create component inside container
    var expComponent:ComponentRef<ImagesComponent> = this.container.createComponent(comp);
    // See explanations
    expComponent.instance.question_id = questionId
    expComponent.instance.data_id = dataId
    expComponent.instance.src = src;

    expComponent.instance._ref = expComponent;
  }

  offlinePreFilledData(x){
    if (x) x.filter(el => this.addComponent(this.questionId, el.data_id, el.src))
  }

  preFilledData() {
    let storedData : any = JSON.parse(localStorage.getItem(this.questionId))
    console.log("storedata is ", storedData)
    // if (storedData) storedData.filter(el=> this.addComponent(el.data_id, el.src))
    // this.presentData = storedData
    if (storedData) storedData.filter(el=> this.addComponent(this.questionId, el.data_id, el.src) )
  }

}

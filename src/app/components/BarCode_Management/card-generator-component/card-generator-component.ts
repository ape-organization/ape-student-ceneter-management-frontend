import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material-module';
import QRCode from 'qrcode';
import { register } from 'swiper/element/bundle';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card-generator-component',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule,TranslateModule],
  templateUrl: './card-generator-component.html',
  styleUrl: './card-generator-component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardGeneratorComponent implements OnInit {

 cardDesignUrl = '';
  numCards = 1;

  qrSize = 80;
  qrTop = 50;
  qrLeft = 50;

  dragging = false;

  sampleStudent:any=null;

  students:any[]=[];

  constructor(private cdr:ChangeDetectorRef){}

  async ngOnInit(){
    register();
    await this.updateSample();
  }


  onFileSelected(event:any){

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload=(e:any)=>{
      this.cardDesignUrl = e.target.result;
      this.cdr.detectChanges();
    }

    reader.readAsDataURL(file);
  }


  async generateQRCode(text:string){

    return await QRCode.toDataURL(text,{
      width:this.qrSize,
      margin:1
    });

  }


  async updateSample(){

    const id='SAMPLE';

    const qrDataUrl = await this.generateQRCode(id);

    this.sampleStudent={
      name:'Sample',
      id,
      qrDataUrl
    };

  }


  async generateCards(){

    const arr=[];

    for(let i=0;i<this.numCards;i++){

      const id=`STU-${Date.now()}-${i}`;

      const qr=await this.generateQRCode(id);

      arr.push({
        name:`Student ${i+1}`,
        id,
        qrDataUrl:qr
      });

    }

    this.students=arr;

    this.cdr.detectChanges();

  }


  onImageLoaded(){
    this.cdr.detectChanges();
  }


  startDrag(event:MouseEvent){

    this.dragging=true;

    this.updatePosition(event);

  }


  @HostListener('document:mousemove',['$event'])
  move(event:MouseEvent){

    if(!this.dragging) return;

    this.updatePosition(event);

  }


  @HostListener('document:mouseup')
  stop(){
    this.dragging=false;
  }


  updatePosition(event:MouseEvent){

    const card=(event.target as HTMLElement).closest('.student-card') as HTMLElement;

    if(!card) return;

    const rect=card.getBoundingClientRect();

    const x=event.clientX-rect.left;
    const y=event.clientY-rect.top;

    this.qrLeft=(x/rect.width)*100;
    this.qrTop=(y/rect.height)*100;

  }


 printCards() {

  const popupWin = window.open('', '_blank', 'width=900,height=700');
  if (!popupWin) return;

  const cards = this.students.map(student => `
    <div class="student-card">
      <img class="background" src="${this.cardDesignUrl}">
      
      <div class="qr-wrapper"
           style="top:${this.qrTop}%; left:${this.qrLeft}%;">
           
        <img class="qr"
             src="${student.qrDataUrl}"
             style="width:${this.qrSize}px">
             
      </div>
    </div>
  `).join('');

  popupWin.document.write(`
  <html>
  <head>
  <title>Print Cards</title>

  <style>

  body{
    margin:20px;
    font-family:sans-serif;
  }

  .student-card{

    width:350px;
    height:220px;

    position:relative;

    display:inline-block;

    margin:10px;

    border-radius:12px;

    overflow:hidden;

  }

  .background{

    position:absolute;

    width:100%;
    height:100%;

    object-fit:cover;

    top:0;
    left:0;

    z-index:1;

  }

  .qr-wrapper{

    position:absolute;

    transform:translate(-50%,-50%);

    z-index:10;

    background:white;

    padding:6px;

    border-radius:6px;

  }

  .qr{
    display:block;
  }

  </style>

  </head>

  <body onload="window.print();window.close()">

  ${cards}

  </body>

  </html>
  `);

  popupWin.document.close();
}

  }
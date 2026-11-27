(function(){'use strict';var $=function(id){return document.getElementById(id);};
var open=false,busy=false,stage=$('giftStage'),card=$('giftCard');
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function T(vi,en){return (window.LANG==='en')?en:vi;}
function measure(){stage.style.setProperty('--lx-lift',Math.ceil(card.offsetHeight+54)+'px');}
measure();
if(window.ResizeObserver)new ResizeObserver(measure).observe(card);
else window.addEventListener('resize',measure);
if(document.fonts)document.fonts.ready.then(measure);
function later(fn,ms){setTimeout(fn,reduced.matches?0:ms);}
function expanded(value){['openGift','giftToggle'].forEach(function(id){$(id).setAttribute('aria-expanded',String(value));});}
function finish(){busy=false;stage.setAttribute('aria-busy','false');stage.dataset.state=open?'open':'closed';$('giftToggle').disabled=false;$('openGift').disabled=open;
$('giftToggle').textContent=open?T('ĐÓNG BAO LÌ XÌ','CLOSE THE ENVELOPE'):T('CHẠM ĐỂ MỞ BAO LÌ XÌ','TAP TO OPEN THE ENVELOPE');}
function toggle(){
 if(busy)return;
 busy=true;stage.setAttribute('aria-busy','true');$('giftToggle').disabled=true;$('openGift').disabled=true;
 if(!open){
  open=true;measure();expanded(true);stage.dataset.state='preparing';stage.classList.add('ready');
  later(function(){
   stage.dataset.state='unsealing';stage.classList.add('unsealed');
   var rect=stage.getBoundingClientRect();
   if(rect.top<70||rect.bottom>innerHeight-60)stage.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
   later(function(){
    stage.dataset.state='extracting';stage.classList.add('open');
    later(function(){card.inert=false;card.setAttribute('aria-hidden','false');finish();},1100);
   },480);
  },480);
 }else{
  open=false;expanded(false);stage.dataset.state='inserting';
  if(card.contains(document.activeElement))$('giftToggle').focus();
  card.inert=true;card.setAttribute('aria-hidden','true');stage.classList.remove('open');
  later(function(){
   stage.dataset.state='sealing';stage.classList.remove('unsealed');
   later(function(){stage.classList.remove('ready');later(finish,480);},480);
  },1100);
 }
}
stage.dataset.state='closed';
$('openGift').onclick=toggle;$('giftToggle').onclick=toggle;
$('copyAccount').onclick=function(){var ok=function(){$('giftStatus').textContent=T('Đã chép số tài khoản.','Account number copied.');};
try{navigator.clipboard.writeText('0123456789').then(ok,function(){$('giftStatus').textContent='MB Bank · 0123456789';});}catch(e){$('giftStatus').textContent='MB Bank · 0123456789';}};
$('saveQR').onclick=function(){var b=this;b.disabled=true;fetch($('giftQR').src).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(blob){
var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='QR-Huong-Giang.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},60000);
$('giftStatus').textContent=T('Đã tải mã QR.','QR saved.');}).catch(function(){$('giftStatus').textContent=T('Nhấn giữ mã QR để lưu ảnh.','Press and hold the QR to save it.');}).then(function(){b.disabled=false;});};
})();

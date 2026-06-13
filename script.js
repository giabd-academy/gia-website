function googleTranslateElementInit(){
  new google.translate.TranslateElement({pageLanguage:'en', includedLanguages:'en,bn,ja', layout:google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
function toggleLanguageBox(){
  const box=document.getElementById('langDropdown');
  if(box){box.classList.toggle('show');}
}
function toggleMenu(){
  const menu=document.getElementById('navMenu');
  if(menu){menu.classList.toggle('show');}
}
document.addEventListener('click',function(e){
  const lang=document.querySelector('.language-switcher');
  const box=document.getElementById('langDropdown');
  if(lang && box && !lang.contains(e.target)){box.classList.remove('show');}
});

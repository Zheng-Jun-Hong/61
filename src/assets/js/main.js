
export default {
    install(Vue){
        Vue.prototype.$globalFunc = {
            esCollapse: function(){ //客制手風琴
                let esCollary = document.querySelectorAll('.es_collapse');
                console.log('test')
                esCollary.forEach(el=>{
                    el.children[0].addEventListener('click',()=>{
                        let ans = el.children[1];
                        let inner = ans.children[0];
                        let height = window.getComputedStyle(inner).getPropertyValue('height');
                        if( el.classList.contains('open') ){
                            el.classList.remove('open')
                            ans.style.height = '0px';
                        }else{
                            el.classList.add('open');
                            ans.style.height = height;
                        }

                    })
                })
            },
            //數字叫出popup
            openEachNumb: function(){
                document.getElementById('numberPopup').style.display = 'block';
                document.body.classList.add('lock')
            },
            //數字關閉popup
            closeEachNumb: function(){
                document.getElementById('numberPopup').style.display = 'none';
                document.body.classList.remove('lock')
            },
            followCursor: function(e,n){
                var t = 0,
                o = 0,
                a = 0,
                r = 0,
                u = 0.1;
                !(function n() {
                    let s = t - a,
                        i = o - r;
                    a += s * u;
                    r += i * u;
                    e.style.transform = "translate3d(" + a + "px," + r + "px,0)";
                    requestAnimationFrame(n);
                })(),
                null == n
                ? document.addEventListener("mousemove", function (e) {
                        (t = e.pageX), (o = e.pageY);
                    })
                : n.addEventListener("mousemove", function (e) {
                        (t = e.pageX), (o = e.pageY);
                    });
            }
        }
    }
}
window.cusVueFunc = {};

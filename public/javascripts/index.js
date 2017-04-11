//function blindData (res){
//    var str='';
//    for(var i=0;i<res.length;i++){
//        var cur=res[i];
//        str+=`<li>
//                        <div class="head">
//                           <a href="detail.html">
//                              <img src="${cur.head_icon}" alt="">
//                           </a>
//                        </div>
//                        <div class="up">
//                           <div class="vote">
//                              <span>${cur.vote}</span>
//                           </div>
//                           <div class="btn">
//                              投TA一票
//                           </div>
//                        </div>
//                        <div class="descr">
//                           <a href="detail.html">
//                             <div>
//                                <span>${cur.username}</span>
//                                <span>|</span>
//                                <span>编号#${cur.id}</span>
//                              </div>
//                              <p>${cur.description}</p>
//                           </a>
//                        </div>
//                    </li>`
//    }
//    $('.coming').html(str)
//}
//$.ajax({
//    url:'/vote/index/data?limit=10&offset=0',
//    method:'GET',
//    dataType:'json',
//    success:function(data){
//        console.log(data.data.objects.length);
//        blindData(data.data.objects)
//    }
//});
let limit=10;
let offset=0;
let total=null;
let url=window.location.href;
const USER_KEY='users';
let indexReg=/\/vote\/index/;
let registerReg=/\/vote\/register/;
let voteFn={
    blindData(data){
        return data.map(cur=>(
            `<li>
                        <div class="head">
                           <a href="detail.html">
                              <img src="${cur.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${cur.vote}</span>
                           </div>
                           <div class="btn">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="detail.html">
                             <div>
                                <span>${cur.username}</span>
                                <span>|</span>
                                <span>编号#${cur.id}</span>
                              </div>
                              <p>${cur.description}</p>
                           </a>
                        </div>
                    </li>`
        )).join("")
    },
    request({url,dataType='json',type='GET',data={},success}){
        $.ajax({url,dataType,type,data,success})
    },
    initIndexData(){
        this.request({
            url:`/vote/index/data?limit=${limit}&offset=${offset}`,
            success:function(res){
                offset+=limit;
                total=res.data.total;
                let users=res.data.objects;
                let str=voteFn.blindData(users);
                $('.coming').html(str)
            }
        });
        loadMore({
            callback: function(load){
                if(offset<total){
                    voteFn.request({
                        url:`/vote/index/data?limit=${limit}&offset=${offset}`,
                        success:function(res){
                            offset+=limit;
                            total=res.data.total;
                            let users=res.data.objects;
                            let str=voteFn.blindData(users);
                            setTimeout(()=>{
                                $('.coming').append(str);
                                load.reset();
                            },2000);
                        }
                    })
                }
                else{
                    load.complete();
                    setTimeout(function(){
                        load.reset();
                    }, 1000)
                }
            }
        });
        //let user = voteFn.getStorage(USER_KEY);
        //user = JSON.parse(user);
        //if(user){
        //    $('.register a').text('个人主页');
        //    $('.username').text(user.username);
        //    $('.no_signed').hide();
        //    $('.register a').attr('href','/vote/detail/'+user.id);
        //}
        //// 退出登录
        //$('.dropout').click(function(){
        //    voteFn.clearStorage(USER_KEY);
        //    location.reload();
        //});
        //$('.mask').click(function(event){
        //    if(event.target.className == 'mask')
        //        $(this).hide();
        //});
        //$('.sign_in').click(function () {
        //    $('.mask').show();
        //});
        //$('.subbtn').click(function(){
        //    let id = $('.usernum').val();
        //    let password = $('.user_password').val();
        //    if(!id || !password){
        //        alert('用户名或密码不能为空');
        //        return;
        //    }
        //    voteFn.request({
        //        url:'/vote/index/info',
        //        type:'POST',
        //        data:{id,password},
        //        success(result){
        //            console.log(result);
        //            if(result.errno==0){
        //                voteFn.setStorage(USER_KEY,JSON.stringify(result.user));
        //                location.reload();
        //            }else{
        //                alert(result.msg);
        //            }
        //        }
        //    })
        //});
    },
    setStorage(key,value){
        localStorage.setItem(key,value)
    },
    getStorage(key){
        return localStorage.getItem(key)
    },
    clearStorage(key){
        localStorage.removeItem(key)
    },
    initRegisterData(){
        let text=$('.username').val();
        if (text.length==0||text==''||text.length>=10)return;
        let password=$('.initial_password').val();
        if(password.length>=10||password==''||password.length==0) return;
        let repass=$('.confirm_password').val();
        if(repass!=password) return;
        let tel=$('.tel').val();
        if(!(/^1\d{10}$/.test(tel))) return;
        let derection=$('.derection').val();
        if (derection.length==0||derection==''||derection.length>=20)  return;
        let sex=$('input[name="name"]:checked').val()
        let user={
            text,password,tel,derection,sex
        };
        this.setStorage(USER_KEY,JSON.stringify(users))
        console.log(user)
        //voteFn.request({
        //    url:'/vote/register/data',
        //    type:'POST',
        //    data:user,
        //    success(result){
        //        if(result.errno == 0){
        //            alert(result.msg);
        //            user.id = result.id;
        //            voteFn.setStorage(USER_KEY,JSON.stringify(user));
        //            location = '/vote/index';
        //        }
        //    }
        //})
    }
};
$(function(){
    if(indexReg.test(url)){
        voteFn.initIndexData();
    }
    else if(registerReg.test(url)){

        $('.rebtn').on('tap',function(){
            voteFn.initRegisterData();
        })
    }

})

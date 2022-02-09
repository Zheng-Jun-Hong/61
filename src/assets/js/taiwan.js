import * as THREE from './plugin/three.module.js';
import {GLTFLoader} from './plugin/GLTFLoader.js';
import {OrbitControls} from './plugin/OrbitControls.js';
import { gsap } from './plugin/gsap.js';


export default {
install(Vue){
Vue.prototype.$taiwan = {
    taiwanThreejs: function(){
        const GLTFmodel = './3d/TW3D.glb'
        const GLTFtexture = './3d/texture_shadow.jpg'
        const stationPointsJson = './3d/pinpoint.json'

        const update_interval = 0.03 //更新間隔秒數
        const pin_point_radius = 0.07 //地圖點半徑
        const pin_point_effect_radius = pin_point_radius //編輯狀態的地圖點特效最大半徑
        const pin_point_effect_scale_max = 5 //編輯狀態的地圖點特效最大倍率
        const pin_point_effect_speed = 50 //編輯狀態的地圖點特效的閃爍及擴散速度
        const saved_pin_point_color = 0x656D74 //地圖點顏色
        const temp_pin_point_color = 0xFF8046 //編輯中的地圖點顏色
        const picked_pin_point_color = 0xFFFFFF //滑鼠指到的地圖點顏色
        const selected_city_color = 0xFFD483

        const container = document.getElementById('taiwanContainer');

        // 點位
        let targetPoint;
        let effectRing;

        let renderer, scene, camera, raycaster, mouse, sMouse, taiwanObj, spotLight, controls, loadedPoints;
        let currentCity = 0;
        let rayTraceTarget = null;
        let clock;
        let toggle = 0.0;
        let isAddingPinPoint = false; //可加點模式的flag

        let tempPinPoint; //尚未儲存的地圖點
        let savedPinPoint = []; //已儲存的地圖點
        let collidingPoint = null; //記錄碰撞到的地圖點

        let btnConfirm;
        let btnSave;

        init();
        animate();

        function mapLoaded() {
            // document.getElementById('maploader').classList.add('loaded');
            //等讀取動畫離開後再轉鏡頭
            setTimeout(() => { gsap.to(camera.position, { duration: 3, ease: "sine.out", x: 0, y: 30, z: 20 }); }, 1000)
        }
        

        function init() {
            container.addEventListener('mousemove', onMouseMove);

            //場景
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xDEE4EA);
            scene.fog = new THREE.Fog(0xDEE4EA, 1000, 3000); //霧化遠端

            //計時器
            clock = new THREE.Clock();

            //攝影機 (角度, 大小, )
            camera = new THREE.PerspectiveCamera(80, container.offsetWidth / container.offsetHeight, 1, 5000);
            camera.position.set(-20, -20, -20);

            //射線
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();
            sMouse = new THREE.Vector2();

            //環境光
            const AmLight = new THREE.AmbientLight(0xDEE4EA); // soft white light
            scene.add(AmLight);

            spotLight = new THREE.SpotLight(0xDEE4EA, 0.1);
            // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
            // scene.add( spotLightHelper );
            spotLight.position.set(0, 30, 0);
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 1.5;
            spotLight.distance = 100;
            spotLight.shadow.camera.near = 10;
            spotLight.shadow.camera.far = 200;
            spotLight.shadow.focus = 1.5; //調整陰影模糊度，但解析度太差了
            scene.add(spotLight);

            //增加底版
            const textureLoader = new THREE.TextureLoader();
            const texttureBG = textureLoader.load(GLTFtexture);
            const groundMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(100, 100),
                new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    depthWrite: true,
                    map: texttureBG
                })
            );
            groundMesh.position.y = -2;
            groundMesh.rotation.x = -Math.PI / 2;
            groundMesh.name = 'Ground Mesh';
            groundMesh.receiveShadow = true;
            scene.add(groundMesh);

            // 引入台灣模型
            const loader = new GLTFLoader();

            loader.load( GLTFmodel,
                function (gltf) {
                    mapLoaded();
                    scene.add(gltf.scene); //加入台灣島地圖
                    taiwanObj = gltf.scene.children;

                    //個別加入材質
                    taiwanObj.forEach(el => {
                        el.material = new THREE.MeshPhongMaterial({ color: 0xffffff, });
                    });
                    //懶得改模型，先這樣
                    taiwanObj.find(el => el.name = "island").scale.y = 0.3;

                    //台灣地圖讀完接著讀取儲存的地圖點
                    loadPinPoints();
                    controls.enabled = true;
                    controls.enableDamping = true;
                    controls.enableZoom = true;

                },
                // called while loading is progressing
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // called when loading has errors
                function (error) {
                    console.warn('沒讀取到 GLTF 模型', error, GLTFmodel);
                }
            );
            

            //設定地圖點物件資訊，初始設定為編輯中顏色
            // const geometry = new THREE.SphereGeometry(pin_point_radius);
            const geometry = new THREE.CircleGeometry(pin_point_radius, 32);
            const targetPointMaterial = new THREE.MeshBasicMaterial({ color: temp_pin_point_color });
            targetPoint = new THREE.Mesh(geometry, targetPointMaterial);
            targetPoint.lookAt(0, 1, 0);
            scene.add(targetPoint);

            //目標地圖點外圈擴散特效物件資訊
            const effectRingGeometry = new THREE.CircleGeometry(pin_point_effect_radius, 32);
            const effectRingMaterial = new THREE.MeshBasicMaterial({ color: temp_pin_point_color, opacity: 0.1, transparent: true });
            effectRing = new THREE.Mesh(effectRingGeometry, effectRingMaterial);
            effectRing.lookAt(0, 1, 0);
            scene.add(effectRing);
            effectRing.visible = false;

            //渲染
            renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.shadowMap.enabled = true; //打開陰影
            renderer.setPixelRatio(window.devicePixelRatio); //畫質像素分辨率
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            container.appendChild(renderer.domElement);

            // controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enabled = false; //開關user控制
            controls.enableDamping = false; //動畫開啟
            controls.enableZoom = false; //是否開啟縮放 
            controls.enablePan = true; //是否開啟右鍵拖曳功能
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = true;
            controls.minDistance = 0;
            controls.maxDistance = 18;
            // controls.maxPolarAngle = Math.PI / 1.5;
            // controls.target.set( 0, 100, 0 );
            window.addEventListener('resize', onWindowResize);

            //取得按鈕物件
            btnConfirm = document.getElementById('testConfirm');
            btnSave = document.getElementById('testSave');
        }

        //讀取儲存的地圖點
        function loadPinPoints() {
            const fileLoader = new THREE.FileLoader();
            fileLoader.load(
                // resource URL
                stationPointsJson,
                // onLoad callback
                function (data) {
                    loadedPoints = JSON.parse(data);

                    //設定儲存的地圖點
                    loadedPoints.forEach(element => {
                        //取得對應的縣市地圖物件
                        const _parentObj = scene.getObjectByName(element.parent);
                        if (_parentObj) {
                            //複製地圖點物件並設成黑色
                            let _loadedPoint = targetPoint.clone();
                            _loadedPoint.material = targetPoint.material.clone();
                            _loadedPoint.material.color.set(saved_pin_point_color);
                            //把點綁在縣市地圖物件下
                            _parentObj.attach(_loadedPoint);
                            //綁好之後再設定位置
                            _loadedPoint.position.x = element.position.x;
                            _loadedPoint.position.y = element.position.y;
                            _loadedPoint.position.z = element.position.z;

                            _loadedPoint.name = element.name;
                            _loadedPoint.userData = {
                                camPosition: element.camPosition
                            };

                            //加到陣列中存起來
                            savedPinPoint.push(_loadedPoint);
                        }

                    });
                },
                // onProgress callback
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // onError callback
                function (err) {
                    console.error('Fail to load pinpoint.json. error:', err);
                }
            );
        }


        //讀取儲存的地圖點
        function loadPinPoints() {
            const fileLoader = new THREE.FileLoader();
            fileLoader.load(
                // resource URL
                'pinpoint.json',
                // onLoad callback
                function (data) {
                    loadedPoints = JSON.parse(data);

                    //設定儲存的地圖點
                    loadedPoints.forEach(element => {
                        //取得對應的縣市地圖物件
                        const _parentObj = scene.getObjectByName(element.parent);
                        if (_parentObj) {
                            //複製地圖點物件並設成黑色
                            let _loadedPoint = targetPoint.clone();
                            _loadedPoint.material = targetPoint.material.clone();
                            _loadedPoint.material.color.set(saved_pin_point_color);
                            //把點綁在縣市地圖物件下
                            _parentObj.attach(_loadedPoint);
                            //綁好之後再設定位置
                            _loadedPoint.position.x = element.position.x;
                            _loadedPoint.position.y = element.position.y;
                            _loadedPoint.position.z = element.position.z;

                            _loadedPoint.name = element.name;
                            _loadedPoint.userData = {
                                camPosition: element.camPosition
                            };

                            //加到陣列中存起來
                            savedPinPoint.push(_loadedPoint);
                        }

                    });
                },
                // onProgress callback
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // onError callback
                function (err) {
                    console.error('Fail to load pinpoint.json. error:', err);
                }
            );
        }

        function onMouseMove(e) {
            sMouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
            sMouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }

        function onWindowResize() {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            controls.update();

            if (rayTraceTarget && toggle > update_interval) {
                raycaster.setFromCamera(sMouse, camera);
                const intersects = raycaster.intersectObjects(taiwanObj);

                //確認是否指到選取的縣市，以及是否指到朝上的面
                if (intersects.length != 0 && intersects[0].object.name == rayTraceTarget.name && intersects[0].face.normal.y > 0.9999) {

                    // 與其他點保持距離
                    let _isColliding = false;
                    let _array = rayTraceTarget.children;
                    if (tempPinPoint) {
                        _array.push(tempPinPoint);
                    }
                    for (let i = 0; i < _array.length && _isColliding == false; i++) {
                        const _child = _array[i];
                        let _worldPosition = new THREE.Vector3();
                        _child.getWorldPosition(_worldPosition);
                        let _dist = intersects[0].point.distanceTo(_worldPosition);
                        if (_dist <= pin_point_radius * 2) {
                            _isColliding = true;
                            if (collidingPoint) {
                                collidingPoint.material.color.set(saved_pin_point_color);
                            }
                            collidingPoint = _child;
                            break;
                        }
                    }

                    //是否碰撞到其他點
                    if (!_isColliding) {
                        // 沒碰撞到其他點就更新位置
                        targetPoint.position.copy(intersects[0].point);
                        targetPoint.position.y += 0.0001;
                        targetPoint.visible = true;

                        // 清除碰撞的地圖點
                        if (collidingPoint) {
                            collidingPoint.material.color.set(saved_pin_point_color);
                            collidingPoint = null;
                        }

                        showPointEffect(targetPoint, temp_pin_point_color)

                        //開啟可加點狀態
                        isAddingPinPoint = true;
                    } else {
                        //碰撞到其他點就亮起該點
                        targetPoint.visible = false;
                        showPointEffect(collidingPoint, picked_pin_point_color);

                        //關閉可加點狀態
                        isAddingPinPoint = false;
                    }
                } else {
                    isAddingPinPoint = false;
                    targetPoint.visible = false;
                    effectRing.visible = false;
                }

                toggle = 0;
            }

            if (effectRing.visible) {
                // 擴散效果
                //利用三角函數圖形做特效，取0~90度轉成弧度
                let _d = Math.cos(degreeToRadians((clock.elapsedTime * pin_point_effect_speed) % 90));
                //換算縮放變化量
                let _scale = 1 + (pin_point_effect_scale_max - 1) * (1 - _d);
                effectRing.scale.x = _scale;
                effectRing.scale.y = _scale;
                effectRing.scale.z = _scale;
                //透明度變化
                effectRing.material.opacity = 1 - Math.abs(Math.cos(_d));

                if (effectRing.targetPoint) {
                    let _worldPosition = new THREE.Vector3();
                    effectRing.targetPoint.getWorldPosition(_worldPosition);
                    effectRing.position.copy(_worldPosition);
                }

                // console.log('scale:', _scale);
                // console.log('opacity:', effectRing.material.opacity);
            }

            toggle += clock.getDelta();

            renderer.render(scene, camera);
        }


        function showPointEffect(point, color) {
            point.material.color.set(color);
            //設定擴散效果
            effectRing.position.copy(point.position);
            effectRing.material.color.set(color);
            let _worldPosition = new THREE.Vector3();
            point.getWorldPosition(_worldPosition);
            effectRing.position.copy(_worldPosition);
            effectRing.visible = true;
            effectRing.targetPoint = point;
            // point.attach(effectRing);
        }
        function hidePointEffect(point) {
            point.material.color.set(saved_pin_point_color);
            effectRing.visible = false;
        }

        function resetMapCam() {

            taiwanObj.forEach(el => {
                gsap.to(el.position, { duration: 0.5, y: 0 });
                gsap.to(el.material.color, { duration: 0.5, r: 1, g: 1, b: 1 });
            });
            gsap.to(controls.target, { duration: 1.5, ease: "expo.out", x: 0, y: 0, z: 0 });
            gsap.to(controls, { duration: 1.5, ease: "expo.out", maxDistance: 18 });
            gsap.to(camera.position, { duration: 3, ease: "sine.out", x: 0, y: 30, z: 20 });
        }

        //選擇後改顏色升起
        //動畫使用
        //GSAP https://greensock.com/get-started/
        //ease 參數 https://greensock.com/docs/v3/Eases
        function selectedChange(city, position, rayTrace) {

            //不知道為什麼 confirm adding 完不會換色，我先reset就換回顏色
            // targetPoint.material.color.set(temp_pin_point_color);

            const seleTar = taiwanObj.find(el => el.name === city);
            const color = new THREE.Color(selected_city_color);
            const playTime = 1.5;


            //沒點點時，座標抓縣市
            if (position == undefined) {
                position = seleTar.position
            }

            gsap.to(seleTar.position, { duration: 1, ease: "expo.out", y: 1 });
            gsap.to(seleTar.material.color, {
                duration: playTime,
                r: color.r, g: color.g, b: color.b
            });

            if (rayTrace) {
                rayTraceTarget = seleTar;
                container.addEventListener('click', AddingPinPoint);
            } else {
                rayTraceTarget = null;
            }

            //攝影機 Distance距離，target 目標座標
            gsap.to(controls, { duration: playTime, ease: "expo.out", maxDistance: 5 });
            gsap.to(controls.target, { duration: playTime, ease: "expo.out", x: position.x, y: position.y, z: position.z });
        }


    } // end three object
}
}
}
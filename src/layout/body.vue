<template>
    
    <div id="layoutWrap">
        <mainNav/>
        <div id="layoutBody">
            <clickNumber @popshow="numbshow" @closePop="clickCloseNumb"/>
            <transition name="fade" mode="out-in">
            <router-view></router-view>
            </transition>
        </div>
    </div>

</template>


<script>
import mainNav from '../layout/mainNav.vue'
import clickNumber from '../components/clickNumber.vue'
export default {
    components: {
        mainNav, clickNumber
    },
    data(){
        return{
            numbshow: false,
        }
    },
    methods: {
        clickShowNumb(){
            numbshow = true
        },
        clickCloseNumb(){
            numbshow = false
        }
    }
};
</script>

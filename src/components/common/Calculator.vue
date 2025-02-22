<template>
   <!-- <div class="modal hide" id="showCalculatorModal"  tabindex="-1" aria-labelledby="Add Stock Adjustment" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-md modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ $t('Calculator') }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
              </div> -->
              <!-- <div class="modal-body"> -->
                <div class="collapseCalcClose">
                    <a type="button" data-bs-toggle="collapse" href="#collapseCalculator" @click="closeCalcBtn">×</a>
                </div>
                <div>
                    <div class="calculator">
                        <div class="answer" data-simplebar>{{ form.answer }}</div>
                        <div class="display">{{ form.logList + form.current }}</div>
                        <div @click="clear" id="clear" class="c_btn operator-c">C</div>
                        <!-- <div @click="sign" id="sign" class="c_btn operator">+/-</div> -->
                        <div @click="percent" id="percent" class="c_btn operator"> % </div>
                        <div @click="divide" id="divide" class="c_btn operator"> / </div>
                        <div @click="times" id="times" class="c_btn operator">*</div>
                        <div @click="append('7')" id="n7" class="c_btn">7</div>
                        <div @click="append('8')" id="n8" class="c_btn">8</div>
                        <div @click="append('9')" id="n9" class="c_btn">9</div>
                        <div @click="minus" id="minus" class="c_btn operator">-</div>
                        <div @click="append('4')" id="n4" class="c_btn">4</div>
                        <div @click="append('5')" id="n5" class="c_btn">5</div>
                        <div @click="append('6')" id="n6" class="c_btn">6</div>
                        <div @click="plus" id="plus" class="c_btn operator" style="grid-row: 7 / 5;grid-column: 4;">+</div>
                        <div @click="append('1')" id="n1" class="c_btn">1</div>
                        <div @click="append('2')" id="n2" class="c_btn">2</div>
                        <div @click="append('3')" id="n3" class="c_btn">3</div>
                        <div @click="append('0')" id="n0" class="zero">0</div>
                        <div @click="dot" id="dot" class="c_btn">.</div>
                        <div @click="equal" id="equal" class="c_btn operator-primary">=</div>
                    </div>
                </div>
              <!-- </div> -->
         <!--  </div>
      </div>
   </div>      -->
</template>


<script setup>

    import { Form, Field, ErrorMessage } from 'vee-validate';
    import * as yup from 'yup';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
    
    import { useAuthStore } from '@/stores/auth';
    import { useI18n } from 'vue-i18n';
    import '@/assets/css/kitchen_style.css';
    import { onKeyStroke } from '@vueuse/core'

    const { t } = useI18n();

    const emit = defineEmits(['closeCalculater']);
    const props = defineProps(['calc_open_close']);

    // watch(
    //     () => props.calc_open_close, (value) => {
    //         console.log('watch   props.calc_open_close ==',props.calc_open_close, value); 
    //     },       
    // );

    function closeCalcBtn(){
        emit('closeCalculater');
    }
    
    onKeyStroke(['Enter',"="], (e) => {
        e.preventDefault();
        equal();
    })
    onKeyStroke(['Add','+'], (e) => {
        e.preventDefault();
        plus();
    })
    onKeyStroke(['Subtract','-'], (e) => {
        e.preventDefault();
        minus();
    })
    onKeyStroke(['Multiply','*'], (e) => {
        e.preventDefault();
        times();
    })
    onKeyStroke(['Divide',"/"], (e) => {
        e.preventDefault();
        divide();
    })
    onKeyStroke(['Delete', 'Backspace', 'Escape'], (e) => {
        clear();
    })
    onKeyStroke('0', (e) => {
        append('0');
    })
    
    onKeyStroke('1', (e) => {
        append('1');
    })
    
    onKeyStroke('2', (e) => {
        append('2');
    })
    
    onKeyStroke('3', (e) => {
        append('3');
    })
    
    onKeyStroke('4', (e) => {
        append('4');
    })
    
    onKeyStroke('5', (e) => {
        append('5');
    })
    
    onKeyStroke('6', (e) => {
        append('6');
    })
    
    onKeyStroke('7', (e) => {
        append('7');
    })
    
    onKeyStroke('8', (e) => {
        append('8');
    })
    
    onKeyStroke('9', (e) => {
        append('9');
    })
    onKeyStroke(['Decimal',"."], (e) => {
        dot();
    })
    onKeyStroke('%', (e) => {
        e.preventDefault();
        percent();
    })
    
    const is_loading = ref(false);

    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
        logList: "",
        current: "0",
        answer: "",
        operatorClicked: true
    };

    const form = reactive({ ...initialState });


    function append(number) {
        if(props.calc_open_close == true){
            if (form.operatorClicked) {
                form.current = "";
                form.operatorClicked = false;
            }
            animateNumber(`n${number}`);
            form.current = `${form.current}${number}`;
        }
    }

    function addtoLog(operator) {
        if (form.operatorClicked == false) {
            form.logList += `${form.current} ${operator} `;
            form.current = "";
            form.operatorClicked = true;
        }
    }

    function animateNumber(number) {
        // let tl = anime.timeline({
        //     targets: `#${number}`,
        //     duration: 250,
        //     easing: "easeInOutCubic"
        // });
        // tl.add({ backgroundColor: "#c1e3ff" });
        // tl.add({ backgroundColor: "#f4faff" });
    }

    function animateOperator(operator) {
        // let tl = anime.timeline({
        //     targets: `#${operator}`,
        //     duration: 250,
        //     easing: "easeInOutCubic"
        // });
        // tl.add({ backgroundColor: "#a6daff" });
        // tl.add({ backgroundColor: "#d9efff" });
    }

    function clear() {
        if(props.calc_open_close == true){
            animateOperator("clear");
            form.current = "";
            form.answer = "";
            form.logList = "";
            form.operatorClicked = false;
        }
    }

    function sign() {
        if(props.calc_open_close == true){
            animateOperator("sign");
            if (form.current != "") {
                form.current =
                    form.current.charAt(0) === "-"
                        ? form.current.slice(1)
                        : `-${form.current}`;
            }
        }
    }

    function percent() {
        if(props.calc_open_close == true){
            animateOperator("percent");
            if (form.current != "") {
                form.current = `${parseFloat(form.current) / 100}`;
            }
        }
    }

    function dot() {
        if(props.calc_open_close == true){
            animateNumber("dot");
            if (form.current.indexOf(".") === -1) {
                append(".");
            }
        }
    }

    function divide() {
        if(props.calc_open_close == true){
            animateOperator("divide");
            addtoLog("/");
        }
    }

    function times() {
        if(props.calc_open_close == true){
            animateOperator("times");
            addtoLog("*");
        }
    }

    function minus() {
        if(props.calc_open_close == true){
            animateOperator("minus");
            addtoLog("-");
        }
    }

    function plus() {
        if(props.calc_open_close == true){
            animateOperator("plus");
            addtoLog("+");
        }
    }

    function equal() {
        if(props.calc_open_close == true){
            animateOperator("equal");
            if (form.operatorClicked == false) {
                form.answer = eval(form.logList + form.current);
            } else {
                form.answer = "WHAT?!!";
            }
        }
    }

</script>
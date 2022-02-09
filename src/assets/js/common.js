import Plotly from "plotly.js";

export default {
    round(num, n) {
        if (
            num == null ||
            num == "---" ||
            num == NaN ||
            num == undefined ||
            num == "undefined"
        ) {
            return "---"
        } else {
            if (num > 0) {
            num = parseInt(num * Math.pow(10, n) + 0.5, 10) / Math.pow(10, n)
            } else if (num < 0) {
            num = num * -1
            num = (parseInt(num * Math.pow(10, n) + 0.5, 10) / Math.pow(10, n)) * -1
            }
            return num
        }
    },
    plot_resize(){
        let update = {
            width: "",
            heigth: "",
        }
        update = {
            width: document.getElementById('plot_div').clientWidth,
            height:  document.getElementById('plot_div').clientHeight,
            margin: this.plot_margin()
        }
        Plotly.relayout("plot_div", update)
    },
    plot_margin(){
        let margin =  {
            l: 70,
            r: 50,
            b: 50,
            t: 50,
            pad: 20,
        }
        return margin
    },
}
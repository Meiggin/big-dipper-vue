<template>
  <!--  -->
  <div class="bank-baking-preview">
    <h3 ref="bankTitle">
      <div @click="back()" v-if="showSpan"></div>
      {{ bankName + bankType + area + title }}
    </h3>

    <div class="bank-list">
      <ul>
        <li @click="handleClick(0)"><p>国有银行</p></li>
        <li @click="handleClick(1)"><p>股份银行</p></li>
        <li @click="handleClick(2)"><p>城市银行</p></li>
        <li @click="handleClick(3)"><p>村镇银行</p></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BankBaking",
  props: ["isLoading"],
  data() {
    return {
      bankName: "杭州市银行",
      bankType: "",
      title: "分布态势",
      showSpan: false,
      area: "",
      num: "",
    };
  },

  mounted() {
    this.bus.$on("area", (val) => {
      console.log(val);
      if (val != "99") {
        this.area = val;
      } else {
        this.area = "";
      }
    });
    this.bus.$on("showSpan", (val) => {
      if (val == true) {
        this.showSpan = true;
      } else {
        this.showSpan = false;
      }
    });
  },
  methods: {
    back() {
      this.$emit("loading", true);
      this.showSpan = false;
      this.bankName = "杭州市银行";
      this.bankType = "";
      this.area = "";
      this.bus.$emit("bankType", null);
      this.bus.$emit("actionFlow", 0);
    },
    ifBankTitle(value) {
      if (value == 0) {
        this.bankName = "杭州市国有银行";
      } else if (value == 1) {
        this.bankName = "杭州市股份银行";
      } else if (value == 2) {
        this.bankName = "杭州市城市银行";
      } else if (value == 3) {
        this.bankName = "杭州市村镇银行";
      }
    },
    handleClick(e) {
      this.showSpan = true;
      this.ifBankTitle(e);
      this.bus.$emit("bankType", e);
      this.bus.$emit("actionFlow", 1);
    },
  },
};
</script>

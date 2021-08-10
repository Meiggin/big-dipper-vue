<template>
  <div class="bank-baking-preview">
    <h3 ref="bankTitle">
      <span @click="back()" v-if="showSpan">&lt;</span>{{ bankNmae + title }}
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
import { translate } from "../../../utils/anime.js";
export default {
  name: "BankBaking",

  data() {
    return {
      bankNmae: "杭州银行",
      title: "分布态势",
      showSpan: false,
    };
  },

  mounted() {},
  methods: {
    back() {
      this.showSpan = false;
      this.bankNmae = "杭州银行";
      translate(this.$refs.bankTitle);
      this.bus.$emit("bankType", null);
    },
    ifBankTitle(value) {
      if (value == 0) {
        this.bankNmae = "杭州市国有银行";
      } else if (value == 1) {
        this.bankNmae = "杭州市股份银行";
      } else if (value == 2) {
        this.bankNmae = "杭州市城市银行";
      } else if (value == 3) {
        this.bankNmae = "杭州市村镇银行";
      }
    },
    handleClick(e) {
      this.showSpan = true;
      this.ifBankTitle(e);
      this.bus.$emit("bankType", e);
    },
  },
};
</script>

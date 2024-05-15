<template>
  <van-number-keyboard
    :show="modelValue"
    @blur="handleShow"
    @input="onInput"
    @delete="onDelete"
    @show="reShowNumber"
    @hide="clearNumber"
    @close="clearNumber"
  />
</template>

<script setup lang="ts">
import useHomeCalculateSalary from "@/hooks/useHomeCalculateSalary";
const props = defineProps(["modelValue", "currentInputStr", "currentEdit"]); //数组|对象写法都可以
const $emit = defineEmits(["update:modelValue"]);

const { onInput, onDelete, reShowNumber, clearNumber } = useHomeCalculateSalary(
  props.currentInputStr,
  props.currentEdit
);

const handleShow = () => {
  $emit("update:modelValue", false);
};
</script>

<style scoped lang="less"></style>

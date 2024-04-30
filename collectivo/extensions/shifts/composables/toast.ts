export default function showShiftToast(
  title: string,
  description: any,
  type: "error" | "success",
) {
  const toast = useToast();

  toast.add({
    title: title,
    description: description,
    icon:
      type == "error"
        ? "i-heroicons-exclamation-triangle"
        : "i-heroicons-check",
    color: type == "error" ? "red" : "green",
  });
}

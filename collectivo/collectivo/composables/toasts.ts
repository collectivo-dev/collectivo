type types = "error" | "success" | "warn" | "info";
type colors = "red" | "green" | "yellow" | "blue";

const defaultTitles = {
  error: "Error",
  success: "Success",
  warn: "Warning",
  info: "Info",
};

const defaultDescriptions = {
  error: "An error occurred",
  success: "Operation successful",
  warn: "",
  info: "",
};

const defaultColors: { [index: string]: colors } = {
  error: "red",
  success: "green",
  warn: "yellow",
  info: "blue",
};

const defaultIcons = {
  error: "i-heroicons-exclamation-triangle",
  success: "i-heroicons-check",
  warn: "i-heroicons-exclamation-triangle",
  info: "i-heroicons-information-circle",
};

export function showCollectivoToast(options: {
  type?: types;
  title?: string;
  description?: any;
  icon?: string;
  color?: colors;
}) {
  const toast = useToast();
  const type = options.type ?? "info";

  toast.add({
    title: options.title ?? defaultTitles[type],
    description: options.description ?? defaultDescriptions[type],
    icon: options.icon ?? defaultIcons[type],
    color: options.color ?? defaultColors[type],
  });
}

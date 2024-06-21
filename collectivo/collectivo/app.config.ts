export default defineAppConfig({
  collectivo: {
    projectName: "Collectivo",
    projectDescription:
      "Collectivo is an open-source platform for collaboration, participation, and data management.",
    logoPath: "/img/logo.png",
    sidebarWidth: 140,
    locales: () => ["de", "en"],
  },
  ui: {
    primary: "meteorite",
    gray: "cool",
    button: {
      font: "font-semibold tracking-wider",
      rounded: "rounded-lg",
      size: {
        sm: "text-sm",
        md: "text-sm",
        lg: "text-base",
        xl: "text-base",
      },
      gap: {
        sm: "gap-x-2",
        md: "gap-x-2",
        lg: "gap-x-2.5",
        xl: "gap-x-2.5",
      },
      padding: {
        sm: "px-2.5 py-1.5",
        md: "px-3.5 py-2.5",
        lg: "px-4 py-3",
        xl: "px-3.5 py-2.5",
      },
      icon: {
        size: {
          sm: "h-4 w-4",
          md: "h-4 w-4",
          lg: "h-5 w-5",
          xl: "h-6 w-6",
        },
      },
    },
    card: {
      base: "mb-5 lg:mb-10 last:mb-0",
      background: "bg-white",
      rounded: "rounded-[20px]",
      divide: "divide-none",
      ring: "ring-1 ring-[#F0F0F0]",
      shadow: "shadow-none",
      body: {
        base: "",
        background: "",
        padding: "p-5 lg:p-10",
      },
    },
    alert: {
      title: "text-lg font-semibold text-primary",
      description: "text-primary/60 text-sm font-medium leading-6 mt-2",
      padding: "p-3 lg:p-5",
      rounded: "rounded-xl",
      icon: {
        base: "flex-shrink-0 h-7 w-7",
      },
      color: {
        success: {
          ghost: "bg-cyan-500 ring-1 bg-cyan-500/50 text-cyan-500",
        },
        error: {
          ghost: "bg-red-light ring-1 ring-red-500/40 text-red-500",
        },
        info: {
          ghost: "bg-blue-light ring-1 ring-blue/50 text-blue-500",
        },
        warning: {
          ghost: "bg-orange-500 ring-1 ring-orange/30 text-orange",
        },
      },
    },
    notification: {
      progress: {
        background: "white",
      },
    },
    tabs: {
      wrapper: "relative space-y-2 border-b border-purple-500",
      container: "relative w-full",
      base: "focus:outline-none",
      list: {
        base: "relative gap-8",
        background: "dark:bg-gray-800",
        rounded: "",
        shadow: "",
        padding: "",
        height: "h-[20px]",
        width: "",
        marker: {
          wrapper:
            "absolute !h-[1px] !top-[29px] left-0 duration-200 ease-out focus:outline-none",
          base: "!h-[1px]",
          background: "bg-primary dark:bg-gray-900",
          rounded: "",
          shadow: "",
        },
        tab: {
          base: "relative outline-none disabled:cursor-not-allowed disabled:opacity-75 duration-200 ease-out",
          background: "",
          active: "text-primary dark:text-white",
          inactive: "text-primary dark:text-gray-500-400",
          height: "",
          padding: "",
          size: "text-sm leading-none",
          font: "font-urbanist font-semibold",
          rounded: "",
          shadow: "",
        },
      },
    },
    // modal: {
    //   wrapper: "relative z-50",
    //   inner: "fixed inset-0 overflow-y-auto",
    //   container:
    //     "flex min-h-full items-end sm:items-center justify-center text-center",
    //   padding: "p-4 sm:p-0",
    //   margin: "sm:my-8",
    //   base: "relative text-left rtl:text-right overflow-hidden w-full flex flex-col",
    //   overlay: {
    //     base: "fixed inset-0 transition-opacity",
    //     background: "bg-primary/20 dark:bg-gray-800/75",
    //     transition: {
    //       enter: "ease-out duration-300",
    //       enterFrom: "opacity-0",
    //       enterTo: "opacity-100",
    //       leave: "ease-in duration-200",
    //       leaveFrom: "opacity-100",
    //       leaveTo: "opacity-0",
    //     },
    //   },
    //   background: "bg-white dark:bg-gray-900",
    //   ring: "",
    //   rounded: "border border-purple-500 rounded-xl",
    //   shadow: "",
    //   width: "sm:max-w-[520px]",
    //   height: "",
    //   transition: {
    //     enter: "ease-out duration-300",
    //     enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    //     enterTo: "opacity-100 translate-y-0 sm:scale-100",
    //     leave: "ease-in duration-200",
    //     leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
    //     leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
    //   },
    // },
    pagination: {
      wrapper: "flex items-center gap-1 lg:gap-2",
      base: "h-8 w-8 lg:h-12 lg:w-12",
      color: "text-primary",
      rounded: "rounded-lg",
      default: {
        size: "pagination",
        activeButton: {
          size: "pagination",
          color: "purple",
          variant: "solid",
        },
        inactiveButton: {
          color: "gray",
          size: "pagination",
          variant: "outline",
        },
        prevButton: {
          color: "gray",
          size: "pagination",
          variant: "outline",
          class: "rtl:[&_span:first-child]:rotate-180",
          icon: "i-heroicons-chevron-left-20-solid w-5 h-5 lg:w-[26px] lg:h-[26px]",
        },
        nextButton: {
          color: "gray",
          size: "pagination",
          variant: "outline",
          class: "rtl:[&_span:last-child]:rotate-180",
          icon: "i-heroicons-chevron-right-20-solid w-5 h-5 lg:w-[26px] lg:h-[26px]",
        },
      },
    },

    // Forms ---------------------------------------------------------------------------------

    formGroup: {
      label: {
        base: "block text-md font-semibold",
      },
    },
    input: {
      wrapper: "relative",
      base: "disabled:cursor-default disabled:opacity-50",
      size: {
        md: "text-sm leading-[18px]",
      },
      variant: {
        solid:
          "shadow-sm bg-blue-50 focus:bg-primary-50 text-gray-900 ring-0 focus:ring-0",
      },
      padding: {
        md: "py-4 px-[18px] pe-9",
        numberInput: "py-4 px-[18px] pe-[56px]",
      },
      rounded: "rounded-lg",
      icon: {
        color: "text-gray-500",
        trailing: {
          wrapper: "end-[5px]",
        },
      },
      default: {
        size: "md",
        color: "primary",
        variant: "solid",
      },
    },
    textarea: {
      variant: {
        solid:
          "shadow-sm bg-blue-50 focus:bg-primary-50 text-gray-900 ring-0 focus:ring-0",
      },
      padding: {
        baseSize: "py-4 px-[18px]",
      },
      rounded: "rounded-lg",
      default: {
        size: "md",
        color: "blue",
        variant: "solid",
      },
    },
    select: {
      base: "h-[50px] disabled:cursor-default disabled:opacity-50",
      rounded: "rounded-lg",
      variant: {
        solid:
          "shadow-sm bg-blue-50 focus:bg-primary-50 text-gray-900 ring-0 focus:ring-0",
      },
      padding: {
        md: "py-4 px-[18px] pe-9",
      },
      icon: {
        trailing: {
          wrapper: "end-[5px] text-gray-500",
        },
      },
      default: {
        size: "md",
        color: "blue",
        variant: "solid",
      },
    },
    selectMenu: {
      ring: "ring-0",
      shadow: "shadow-lg",
      rounded: "rounded-lg",
      // TODO: Add light border "border-1 border-[#edf0f7]",
    },
    checkbox: {
      base: "h-[18px] w-[18px] disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
      background: "bg-transparent",
      rounded: "rounded-[5px]",
      border: "border border-gray-500",
      label: "text-sm font-medium",
    },
    radioGroup: {
      wrapper: "flex items-start",
      base: "h-4 w-4 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-purple focus:ring-offset-active",
      color: "text-purple-500",
      background: "bg-purple dark:bg-gray-900",
      border: "border border-gray-500-300 dark:border-gray-500-700",
      ring: "focus-visible:ring-2 focus-visible:ring-primary  focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
      label: "text-sm font-medium text-gray-500-700 dark:text-gray-500-200",
      default: {
        color: "primary",
      },
    },
    radio: {
      wrapper:
        "relative flex items-start bg-[#F4F7FE] shadow-sm rounded-lg mb-2 last:mb-0 px-5 py-3",
    },
  },
});

export const getMessageStyles = (msg) => {
    switch (msg.role) {
      case "user":
        return { alignment: "right", bgColor: "#e3f2fd", textColor: "#0d47a1" };
      case "assistant":
        return { alignment: "left", bgColor: "#eeeeee", textColor: "#212121" };
      case "system":
        return { alignment: "center", bgColor: "#fff3cd", textColor: "#856404" };
      default:
        return { alignment: "left", bgColor: "#ffffff", textColor: "#000000" };
    }
  };
  
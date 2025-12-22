# 📘 SmartURLs Notification FAQ (KO)

이 FAQ는 키보드 바로가기를 사용할 때 확인 알림이 표시되지 않을 수 있는 이유를 설명합니다.
알림은 OS와 브라우저 설정에 의해 제어됩니다. SmartURLs는 이러한 규칙을 변경할 수 없습니다.

## 💻 Windows Notification Behavior

**Q: Windows에서 알림 팝업이 가끔 보이지 않는 이유는 무엇인가요?**

Windows의 알림 동작은 **시스템 알림 설정**과 **Focus Assist (Do Not Disturb)**에 따라 달라집니다.
이는 정상적인 시스템 동작이며 버그가 아닙니다.

**왜 발생하나요:**

- Windows가 알림 팝업의 표시 방식과 타이밍을 제어합니다
- 알림은 다음과 같을 수 있습니다:
  - 팝업으로 표시
  - 그룹화 또는 접기
  - **Focus Assist**에 의해 억제
- SmartURLs는 알림 표시 여부를 제어할 수 없습니다

**Windows에서 확인할 사항:**

- **Google Chrome에 대한 알림이 활성화되어 있음**
  - Settings -> System -> Notifications -> Google Chrome
- **Focus Assist가 비활성화되어 있음**
  - Settings -> System -> Focus

**중요한 참고:**

- 알림이 숨겨져 있어도 단축키는 정상적으로 동작합니다
- 확인 메시지는 알림 센터에 기록될 수 있습니다

---

## 🍎 macOS Notification Behavior

**Q: macOS에서 알림 팝업이 보이지 않는데도 동작하는 이유는 무엇인가요?**

macOS에서는 Chrome 확장의 알림이 **"Google Chrome Helper (Alerts)"**를 통해 전달되며, 시스템 설정에 따라 팝업으로 표시되지 않을 수 있습니다.
이는 정상적인 시스템 동작이며 버그가 아닙니다.

**왜 발생하나요:**

- macOS가 알림 표시를 완전히 제어합니다
- 알림은 다음에 의해 억제될 수 있습니다:
  - 알림 스타일이 **None**으로 설정됨
  - **Focus Mode / Do Not Disturb**
  - 포커스 설정이 **기기 간 공유**됨
- Chrome 확장은 이러한 규칙을 변경할 수 없습니다

**macOS에서 확인할 사항:**

- System Settings -> Notifications -> **Google Chrome Helper (Alerts)**
  - Allow Notifications: **On**
  - Style: **Banners** or **Alerts**
- System Settings -> **Focus Mode**
  - Make sure Focus Mode is disabled
  - Check **Share Across Devices**

**중요한 참고:**

- 팝업이 표시되지 않아도 알림 센터에 기록되는 것이 일반적입니다
- 아무 동작이 없으면 작업은 안전하게 취소됩니다

---

## 🐧 Linux Notification Behavior

**Q: Linux에서 키보드 바로가기를 사용할 때 알림 팝업이 보이는 이유는 무엇인가요?**

Linux에서 키보드 바로가기(Ctrl+Shift+U 또는 Ctrl+Shift+V)를 사용하면 작은 알림 팝업이 나타날 수 있습니다.
이는 정상적인 동작이며 버그가 아닙니다.

**왜 발생하나요:**

- Linux 데스크톱 환경(GNOME, KDE, Xfce 등)이 알림 표시 방식을 제어합니다
- SmartURLs는 동작 확인을 위해 알림을 사용합니다
- 확장 프로그램은 알림 표시 여부를 제어할 수 없습니다

**Linux에서 확인하거나 조정할 사항:**

데스크톱 환경에서 Chrome 알림 설정을 조정하여 알림 표시 방식을 변경할 수 있습니다:

- **GNOME:** Settings -> Notifications -> Google Chrome
- **KDE:** System Settings -> Notifications -> Applications -> Google Chrome
- **Xfce:** Settings -> Notifications -> Applications -> Google Chrome

알림 표시 여부와 관계없이 단축키는 정상적으로 동작합니다.

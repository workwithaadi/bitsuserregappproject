# Popify

Popify is a lightweight toast notification library built on top of [Toastify.js](https://github.com/apvarun/toastify-js). It provides a simple API to display customizable toast notifications with ease.

## Features

- Lightweight and fast.
- Easy to use API.
- Predefined success and error notifications.
- Customizable duration, position, and styles.

## Installation

You can install Popify using npm:

```bash
npm install popify-js
```

## Usage

### Import Popup

First, import Popify into your project:

```javascript
import Popup from "popify";
```

### Basic Notification

```javascript
Popup.show("Hello, World!");
```

### Success Notification

```javascript
Popup.success("Operation successful!");
```

### Error Notification

```javascript
Popup.error("Something went wrong.");
```

## API

### `Popup.show(message)`
- **message**: The message to display in the notification.

### `Popup.success(message)`
- **message**: The success message to display.

### `Popup.error(message)`
- **message**: The error message to display.

## Customization

You can modify the default behavior of Popify by editing the source file or extending the functionality. Since it is built on Toastify.js, you can also leverage all the customization options provided by Toastify.

Refer to the [Toastify.js documentation](https://github.com/apvarun/toastify-js#options) for more details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the Apache License 2.0. See the LICENSE file for details.

## Acknowledgments

- Built with [Toastify.js](https://github.com/apvarun/toastify-js).
- Thanks to the open-source community for inspiration and support.

---

Happy coding! 🚀


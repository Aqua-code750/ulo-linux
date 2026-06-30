/* a) Purpose: Original login screen built as native Ulo component for SDDM.
   c) Install/Test: Place in /usr/share/sddm/themes/ulo/Main.qml
   d) Open decisions: Using QtQuick to render the UI. */

import QtQuick 2.15
import QtQuick.Controls 2.15
import SddmComponents 2.0

Rectangle {
    id: container
    width: 1920
    height: 1080
    color: "#0f1115" // Ulo Dark background

    // Background Image
    Image {
        anchors.fill: parent
        source: config.background
        fillMode: Image.PreserveAspectCrop
        opacity: 0.8
    }

    // Login Box centered
    Rectangle {
        width: 400
        height: 350
        color: "transparent"
        anchors.centerIn: parent

        // User Avatar
        Image {
            id: avatar
            width: 120
            height: 120
            anchors.horizontalCenter: parent.horizontalCenter
            source: userModel.lastUser.icon || "default-avatar.png"
            fillMode: Image.PreserveAspectCrop
            // Clip to circle
            layer.enabled: true
            layer.effect: ShaderEffect {
                fragmentShader: "
                    varying highp vec2 qt_TexCoord0;
                    uniform sampler2D source;
                    void main() {
                        highp vec2 p = qt_TexCoord0 - vec2(0.5);
                        if(length(p) > 0.5) discard;
                        gl_FragColor = texture2D(source, qt_TexCoord0);
                    }
                "
            }
        }

        // Username Text
        Text {
            id: lblName
            text: userModel.lastUser
            color: "#ffffff"
            font.pixelSize: 24
            font.bold: true
            anchors.top: avatar.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter
        }

        // Password Input
        TextField {
            id: passwordField
            width: 250
            height: 40
            anchors.top: lblName.bottom
            anchors.topMargin: 20
            anchors.horizontalCenter: parent.horizontalCenter
            placeholderText: "Password"
            echoMode: TextInput.Password
            font.pixelSize: 16
            color: "#ffffff"
            background: Rectangle {
                color: "#1e1e1e"
                radius: 20
                border.color: passwordField.activeFocus ? "#00ff99" : "#444" // Ulo Green on focus
            }
            onAccepted: sddm.login(userModel.lastUser, passwordField.text, sessionModel.lastIndex)
        }
    }
}

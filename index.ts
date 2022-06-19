import * as UI from "./JavascriptUI"

class MyView implements UI.View {
    body = UI.Body(function() {
        UI.Text("Direction")
            .font(UI.Font.title)
            .margin(25)
        UI.Group(function() {
            UI.Text("Row")
                .font(UI.Font.title)
            UI.HStack(function() {
                UI.Text("Left")
                UI.Divider()
                UI.Text("Right")
            })
        })
            .margin(50)
        UI.Divider()
        UI.Group(function() {
            UI.Text("Column")
                .font(UI.Font.title)
            UI.VStack(function() {
                UI.Text("Top")
                UI.Divider()
                UI.Text("Bottom")
            })
        })
            .margin(50)
        UI.Spacer()
    })
}

new MyView()
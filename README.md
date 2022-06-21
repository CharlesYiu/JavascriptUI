# JavascriptUI
something like swiftui  
  
the goal of this project is to generate html from swiftui-like syntax.  
for example, this piece of code in SwiftUI
```Swift
struct MyView: View {
    var body: some View {
        VStack {
            Text("Direction")
                .font(.title)
                .padding(25)
            Group {
                Text("Row")
                    .font(.title)
                HStack {
                    Text("Left")
                    Divider()
                    Text("Right")
                }
            }
                .padding(50)
            Divider()
            Group {
                Text("Column")
                    .font(.title)
                VStack {
                    Text("Top")
                    Divider()
                    Text("Bottom")
                }
            }
                .padding(50)
            Spacer()
        }
    }
}
```
would be like this in JavascriptUI
```Typescript
class MyView implements UI.View {
    body = UI.Body(function() {
        UI.Text("Direction")
            .font(UI.Font.title)
            .padding(25)
        UI.Group(function() {
            UI.Text("Row")
                .font(UI.Font.title)
            UI.HStack(function() {
                UI.Text("Left")
                UI.Divider()
                UI.Text("Right")
            })
        })
            .padding(50)
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
            .padding(50)
        UI.Spacer()
    })
}
```
# elements
i have implemented basic elements for displaying text including
## JavascriptUI.HStack
This resembles the div shown below
```html
<div style="display: flex; flex-flow: row;">
   ...
</div>
```
## JavascriptUI.VStack
This resembles the div shown below
```html
<div style="display: flex; flex-flow: column;">
   ...
</div>
```
## JavascriptUI.Group
This resembles the div shown below
```html
<div style="display: flex; flex-flow: inherit;">
   ...
</div>
```
## JavascriptUI.Text
This could be a h1 if the font is set to be a title
```html
<h1>...</h1>
```
or be a p element if it's just set to be normal text
```html
<p>...</p>
```
## JavascriptUI.Spacer
This resembles the div shown below
```html
<div style="flex: 1 1 auto;"></div>
```
## JavascriptUI.Divider
### for parents with flex-flow: column;
```html
<span style="background-color: #000000; width: auto; height: 5px;"></span>
```
### for parents with flex-flow: row;
```html
<span style="background-color: #000000; width: 5px; height: auto;"></span>
```

import React from 'react';
import { FlexWidget, TextWidget, registerWidgetTaskHandler } from 'react-native-android-widget';

export function Up2D8Widget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#000000',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextWidget
        text="All clear today"
        style={{ fontSize: 17, color: '#FFFFFF', fontWeight: 'bold' }}
      />
    </FlexWidget>
  );
}

// Handler
export async function widgetTaskHandler(props: any) {
  // Update logic here
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
      // Render widget
      // const widget = <Up2D8Widget />;
      // requestWidgetUpdate({ ...props, widget });
      break;
    default:
      break;
  }
}

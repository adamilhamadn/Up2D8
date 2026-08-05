import React from 'react';
import { FlexWidget, TextWidget, requestWidgetUpdate } from 'react-native-android-widget';
import { getDatabase } from '../db/database';
import { Task } from '../db/types';
import { format } from 'date-fns';

interface Up2D8WidgetProps {
  tasks: Task[];
}

export function Up2D8Widget({ tasks }: Up2D8WidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#111111',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'column',
      }}
    >
      <TextWidget
        text="Up2D8 Agenda"
        style={{ fontSize: 14, color: '#8E8E93', fontWeight: 'bold', marginBottom: 8 }}
      />
      {tasks.length === 0 ? (
        <FlexWidget style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextWidget
            text="All clear today!"
            style={{ fontSize: 17, color: '#FFFFFF', fontWeight: 'bold' }}
          />
        </FlexWidget>
      ) : (
        tasks.slice(0, 3).map((task) => (
          <FlexWidget
            key={task.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1C1C1E',
              padding: 12,
              borderRadius: 12,
              marginBottom: 8,
            }}
          >
            <FlexWidget style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#8E8E93', marginRight: 12 }} />
            <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
              <TextWidget
                text={task.title}
                style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '500' }}
                maxLines={1}
              />
              {task.due_date && (
                <TextWidget
                  text={format(new Date(task.due_date), 'h:mm a')}
                  style={{ fontSize: 13, color: '#8E8E93' }}
                />
              )}
            </FlexWidget>
          </FlexWidget>
        ))
      )}
    </FlexWidget>
  );
}

export async function widgetTaskHandler(props: any) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      try {
        const db = await getDatabase();
        const tasks = await db.getAllAsync<Task>(
          `SELECT * FROM tasks WHERE status = 'active' ORDER BY due_date ASC LIMIT 5`
        );
        const widget = <Up2D8Widget tasks={tasks} />;
        requestWidgetUpdate({
          widgetName: 'Up2D8Widget',
          renderWidget: () => <Up2D8Widget tasks={tasks} />
        });
      } catch (e) {
        console.error('Widget update failed', e);
      }
      break;
    default:
      break;
  }
}

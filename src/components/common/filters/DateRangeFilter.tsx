import { IconCalendar } from '@tabler/icons-react';
import { Col, DatePicker, Flex, Popover, Row } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import React, { useState, useRef } from 'react';
import { cn } from '~/lib';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

// === PRESET OPTIONS
export const dateOptions: Record<string, () => [Dayjs, Dayjs]> = {
  Today: () => [dayjs().startOf('day'), dayjs().endOf('day')],
  Yesterday: () => [
    dayjs().subtract(1, 'day').startOf('day'),
    dayjs().subtract(1, 'day').endOf('day'),
  ],
  'This Week': () => [dayjs().startOf('isoWeek'), dayjs().endOf('isoWeek')],
  'Last Week': () => [
    dayjs().subtract(1, 'week').startOf('isoWeek'),
    dayjs().subtract(1, 'week').endOf('isoWeek'),
  ],
  'Last 7 Days': () => [
    dayjs().subtract(6, 'day').startOf('day'),
    dayjs().endOf('day'),
  ],
  'Last 14 Days': () => [
    dayjs().subtract(13, 'day').startOf('day'),
    dayjs().endOf('day'),
  ],
  'This Month': () => [dayjs().startOf('month'), dayjs().endOf('month')],
  'Last Month': () => [
    dayjs().subtract(1, 'month').startOf('month'),
    dayjs().subtract(1, 'month').endOf('month'),
  ],
  'Last 30 Days': () => [
    dayjs().subtract(29, 'day').startOf('day'),
    dayjs().endOf('day'),
  ],
  'This Quarter': () => [dayjs().startOf('quarter'), dayjs().endOf('quarter')],
  'All Time': () => [dayjs('2020-01-01').startOf('day'), dayjs().endOf('day')],
};

export const presetLabelsVi: Record<string, string> = {
  Today: 'Hôm nay',
  Yesterday: 'Hôm qua',
  'This Week': 'Tuần này',
  'Last Week': 'Tuần trước',
  'Last 7 Days': '7 ngày qua',
  'Last 14 Days': '14 ngày qua',
  'This Month': 'Tháng này',
  'Last Month': 'Tháng trước',
  'Last 30 Days': '30 ngày qua',
  'This Quarter': 'Quý này',
  'All Time': 'Toàn thời gian',
};

export type DateOptionKey = keyof typeof dateOptions;

export type FormContentProps = {
  value?: [string, string];
  onValueChange?: (
    value?: [string, string],
    label?: string,
    type?: string
  ) => void;
  label?: string;
};

export interface DateRangeFilterProps extends FormContentProps {
  title?: string;
  classRootName?: string;
  defaultPreset?: DateOptionKey;
}

export function DateRangeFilter({ defaultPreset = 'Last 30 Days', ...props }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string>(() => {
    if (props.label) return props.label;
    if (!props.value) return presetLabelsVi[defaultPreset] || defaultPreset;
    const [s, e] = props.value;
    const ds = dayjs(s);
    const de = dayjs(e);

    for (const key of Object.keys(dateOptions) as DateOptionKey[]) {
      const [pStart, pEnd] = dateOptions[key]();
      if (ds.isSame(pStart, 'day') && de.isSame(pEnd, 'day')) {
        return presetLabelsVi[key] || key;
      }
    }
    return 'custom';
  });

  const [selectionType, setSelectionType] = useState<'none' | 'preset' | 'custom'>(() => {
    if (!props.value) return 'preset';
    const [s, e] = props.value;
    const ds = dayjs(s);
    const de = dayjs(e);

    for (const key of Object.keys(dateOptions) as DateOptionKey[]) {
      const [pStart, pEnd] = dateOptions[key]();
      if (ds.isSame(pStart, 'day') && de.isSame(pEnd, 'day')) {
        return 'preset';
      }
    }
    return 'custom';
  });

  const isPresetClickRef = useRef(false);

  // string → dayjs
  const dayjsValue =
    props.value && props.value.length === 2
      ? [dayjs(props.value[0]), dayjs(props.value[1])]
      : undefined;

  // dayjs → string [ISOString, ISOString]
  const toStringRange = (v: [Dayjs, Dayjs]): [string, string] => [
    v[0].startOf('day').toISOString(),
    v[1].endOf('day').toISOString(),
  ];

  const detectType = (
    start: Dayjs,
    end: Dayjs,
    lbl?: string
  ): 'day' | 'week' | 'month' | 'quarter' | 'all' | 'custom' => {
    if (lbl) {
      if (['Today', 'Yesterday', 'Hôm nay', 'Hôm qua'].includes(lbl)) return 'day';
      if (['This Week', 'Last Week', 'Last 7 Days', 'Last 14 Days', 'Tuần này', 'Tuần trước', '7 ngày qua', '14 ngày qua'].includes(lbl))
        return 'week';
      if (['This Month', 'Last Month', 'Last 30 Days', 'Tháng này', 'Tháng trước', '30 ngày qua'].includes(lbl))
        return 'month';
      if (['This Quarter', 'Quý này'].includes(lbl)) return 'quarter';
      if (['All Time', 'Toàn thời gian'].includes(lbl)) return 'all';
    }

    if (start.isSame(end, 'day')) return 'day';
    if (start.startOf('isoWeek').isSame(start) && end.endOf('isoWeek').isSame(end)) {
      return 'week';
    }
    if (start.isSame(end, 'month')) return 'month';
    if (start.isSame(end, 'quarter')) return 'quarter';

    return 'custom';
  };

  // Main handler
  const handleValueChange = (val?: [Dayjs, Dayjs], rawLbl?: string) => {
    // Case user cleared custom
    if (!val && rawLbl === 'Custom') {
      props.onValueChange?.(undefined);
      setLabel('');
      setSelectionType('none');
      setOpen(false);
      return;
    }

    if (!val) return;

    // preset
    if (rawLbl && rawLbl !== 'Custom') {
      const displayLbl = presetLabelsVi[rawLbl] || rawLbl;
      setLabel(displayLbl);
      setSelectionType('preset');
      props.onValueChange?.(
        toStringRange(val),
        displayLbl,
        detectType(val[0], val[1], rawLbl)
      );
      setOpen(false);
      return;
    }

    // custom
    if (rawLbl === 'Custom') {
      setLabel('Tùy chọn');
      setSelectionType('custom');
      props.onValueChange?.(toStringRange(val), 'Tùy chọn', 'custom');
      setOpen(false);
    }
  };

  // display label
  const displayText = () => {
    if (selectionType === 'none') return 'Chọn thời gian';
    if (selectionType === 'preset') return label;

    if (props.value && props.value.length === 2) {
      return `${dayjs(props.value[0]).format('DD/MM/YYYY')} - ${dayjs(props.value[1]).format('DD/MM/YYYY')}`;
    }
    return label || 'Chọn thời gian';
  };

  return (
    <Flex gap={12} className={props?.classRootName}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="bottomRight"
        trigger="click"
        arrow={false}
        overlayStyle={{ width: 420 }}
        content={
          <div className="flex flex-col gap-3 p-2 font-sans">
            <FormSelectDateContent
              value={dayjsValue as any}
              onPresetClick={() => {
                isPresetClickRef.current = true;
              }}
              onValueChange={handleValueChange}
            />

            <div className="border-t border-gray-100 pt-2">
              <span className="text-xs font-semibold text-gray-500 mb-1.5 block">Khoảng ngày tùy chọn:</span>
              <FormDatePickerContent
                value={dayjsValue as any}
                onValueChange={(val, lbl) => {
                  if (isPresetClickRef.current) {
                    isPresetClickRef.current = false;
                    return;
                  }
                  handleValueChange(val, lbl);
                }}
              />
            </div>
          </div>
        }
      >
        <div
          className={cn(
            'border border-gray-200 hover:border-sky-500 bg-white cursor-pointer min-w-[190px] h-9 rounded-lg text-xs sm:text-sm flex items-center justify-between px-3 gap-2 shadow-2xs hover:shadow-xs transition-all'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <IconCalendar size={17} className="text-sky-600 shrink-0" />
            <span className="font-semibold text-gray-700 truncate">{displayText()}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">▼</span>
        </div>
      </Popover>
    </Flex>
  );
}

// === PRESET SELECTOR ===================================
function FormSelectDateContent({
  onValueChange,
  onPresetClick,
  value,
}: {
  onValueChange: (val?: [Dayjs, Dayjs], lbl?: string) => void;
  onPresetClick: () => void;
  value?: [Dayjs, Dayjs];
}) {
  const handleSelect = (optionKey: DateOptionKey) => {
    onPresetClick();
    onValueChange(dateOptions[optionKey](), optionKey);
  };

  const isSelected = (optionKey: DateOptionKey) => {
    if (!value) return false;
    const [s, e] = dateOptions[optionKey]();
    return value[0].isSame(s, 'day') && value[1].isSame(e, 'day');
  };

  const dayWeekOptions: DateOptionKey[] = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'Last 7 Days',
    'Last 14 Days',
  ];

  const monthQuarterOptions: DateOptionKey[] = [
    'Last 30 Days',
    'This Month',
    'Last Month',
    'This Quarter',
    'All Time',
  ];

  return (
    <Row gutter={[20, 12]}>
      <Col span={12}>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
            Theo ngày & tuần
          </label>
          {dayWeekOptions.map((key) => {
            const active = isSelected(key);
            return (
              <button
                key={key}
                type="button"
                className={cn(
                  'text-left text-xs py-1 px-2 rounded-md transition-colors cursor-pointer',
                  active
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                )}
                onClick={() => handleSelect(key)}
              >
                {presetLabelsVi[key] || key}
              </button>
            );
          })}
        </div>
      </Col>

      <Col span={12}>
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
            Theo tháng & quý
          </label>
          {monthQuarterOptions.map((key) => {
            const active = isSelected(key);
            return (
              <button
                key={key}
                type="button"
                className={cn(
                  'text-left text-xs py-1 px-2 rounded-md transition-colors cursor-pointer',
                  active
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                )}
                onClick={() => handleSelect(key)}
              >
                {presetLabelsVi[key] || key}
              </button>
            );
          })}
        </div>
      </Col>
    </Row>
  );
}

// === CUSTOM DATE PICKER ===================================
function FormDatePickerContent({
  onValueChange,
  value,
}: {
  onValueChange: (val?: [Dayjs, Dayjs], lbl?: string) => void;
  value?: [Dayjs, Dayjs];
}) {
  const handleChange = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
      return onValueChange(undefined, 'Custom');
    }

    onValueChange([dates[0].startOf('day'), dates[1].endOf('day')], 'Custom');
  };

  return (
    <DatePicker.RangePicker
      allowClear
      value={value}
      onChange={handleChange}
      format="DD/MM/YYYY"
      className="w-full !rounded-lg"
      placeholder={['Từ ngày', 'Đến ngày']}
    />
  );
}

export default DateRangeFilter;

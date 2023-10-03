import React, { useEffect, useMemo } from 'react';
import s from '@pages/Warehouse/index.module.scss';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DatePicker, Debounce, Icon, SelectCustom } from '@/components';
import { ErrorBoundaryHoc } from '@components/ErrorBoundary';
import { useSearchParamsState } from '@/hooks';
import clsx from 'clsx';
import dayjs from 'dayjs';

const selectConf = {
  floatLabel: true,
  placeholder: null,
  thin: true,
  getOptionValue: option => option.id,
  getOptionLabel: option => option.name,
};

export const TableFilter = ErrorBoundaryHoc(() => {
  const warehouseList = useSelector(state => state.warehouse.warehouseList);
  const roleId = useSelector(state => state.auth.user?.role_id);
  const orders = useSelector(state => state.container.orders);
  const warehousesForReturn = useSelector(state => state.container.warehousesForReturn);
  const customsTypes = useSelector(state => state.container.customsTypes);
  const states = useSelector(state => state.container.states);
  const statuses = useSelector(state => state.container.statuses);
  const warehouseInWayFrom = useSelector(state => state.container.warehouseInWayFrom);
  const warehouseInWayTo = useSelector(state => state.container.warehouseInWayTo);
  const ownershipType = useSelector(state => state.container.ownershipType);
  const [searchParams, setSearchParams] = useSearchParamsState();
  const { warehouseId } = useParams();
  const { t } = useTranslation();

  const onSelectChange = ({ id }, { name }) => {
    setSearchParams({ [name]: id });
  };

  const setSelectValue = (arr, key, isString = false) => {
    const transformedKey = isString ? searchParams.get(key) : +searchParams.get(key);
    return arr?.find(({ id }) => id === transformedKey) || null;
  };

  const setDate = key => {
    const date = searchParams.get(key);
    return date ? dayjs(date, 'DD.MM.YYYY').toDate() : null;
  };

  const actualsOptions = useMemo(() => {
    return [
      { name: t('yes').slice(0, 1).toUpperCase() + t('yes').slice(1), id: 'true' },
      { name: t('no').slice(0, 1).toUpperCase() + t('no').slice(1), id: 'false' },
      { name: t('all'), id: '' },
    ];
  }, []);

  useEffect(() => {
    if (!searchParams.get('page') || !searchParams.get('page_size')) {
      setSearchParams({
        page: '1',
        page_size: '25',
      });
    }
  }, []);

  return (
    <div className={s.filterWrap}>
      <div className={clsx(s.filterContainer, s.filter)}>
        <div>
          <SelectCustom
            value={setSelectValue(orders, 'ordering', true)}
            name="ordering"
            onChange={onSelectChange}
            style={{ gridColumn: 'span 3' }}
            options={orders || []}
            labelText={t('clientFilterSortable')}
            {...selectConf}
          />
          {roleId === 5 && !warehouseId && (
            <SelectCustom
              onChange={onSelectChange}
              labelText={t('warehousePage')}
              name="warehouse"
              style={{ gridColumn: 'span 3' }}
              options={warehouseList || []}
              value={setSelectValue(warehouseList, 'warehouse')}
              {...selectConf}
            />
          )}
        </div>
        <div>
          <SelectCustom
            isMulti
            async
            name="number"
            labelText={
              t('containerNumber').slice(0, 1).toUpperCase() + t('containerNumber').slice(1)
            }
            {...selectConf}
          />
          <DatePicker
            floatLabel
            name="arrival_date"
            labelText={t('arrivalToWarehouseDate')}
            selected={setDate('arrival_date')}
            onChange={date => setSearchParams({ arrival_date: date.toLocaleDateString(), page: 1 })}
            thin
            style={{ minWidth: 160 }}
          />
          <SelectCustom
            options={ownershipType || []}
            value={setSelectValue(ownershipType, 'ownership_type')}
            onChange={onSelectChange}
            name="ownership_type"
            placeholder={null}
            labelText={t('ownershipType')}
            {...selectConf}
          />
          <Debounce
            name="owner"
            labelText={t('owner')}
            thin
            floatLabel
            value={searchParams.get('owner') || ''}
            onChange={e => setSearchParams({ owner: e.target.value, page: 1 })}
          />
          <SelectCustom
            name="state"
            options={states || []}
            value={setSelectValue(states, 'state')}
            onChange={onSelectChange}
            placeholder={null}
            labelText={t('state')}
            {...selectConf}
          />
          <SelectCustom
            options={statuses || []}
            value={setSelectValue(statuses, 'status')}
            onChange={onSelectChange}
            name="status"
            placeholder={null}
            labelText={t('status').slice(0, 1).toUpperCase() + t('status').slice(1)}
            {...selectConf}
          />
        </div>
        <div>
          <DatePicker
            floatLabel
            name="return_date"
            labelText={t('returnDate')}
            thin
            selected={setDate('return_date')}
            onChange={date => setSearchParams({ return_date: date.toLocaleDateString(), page: 1 })}
          />
          <SelectCustom
            name="return_warehouse"
            options={warehousesForReturn || []}
            value={setSelectValue(warehousesForReturn, 'return_warehouse')}
            onChange={onSelectChange}
            labelText={t('returnWarehouse')}
            {...selectConf}
          />
          <SelectCustom
            name="customs_type"
            labelText={t('customsType')}
            options={customsTypes || []}
            value={setSelectValue(customsTypes, 'customs_type')}
            onChange={onSelectChange}
            {...selectConf}
          />
          <div className={s.filterGroup}>
            <Debounce
              floatLabel
              thin
              labelText={t('weightFrom')}
              name="weight_min"
              value={searchParams.get('weight_min') || ''}
              onChange={e => setSearchParams({ weight_min: e.target.value, page: 1 })}
              type="number"
            />
            <Debounce
              floatLabel
              thin
              labelText={t('weightTo')}
              name="weight_max"
              value={searchParams.get('weight_max') || ''}
              onChange={e => setSearchParams({ weight_max: e.target.value, page: 1 })}
              type="number"
            />
          </div>
          <div className={s.filterGroup}>
            <Debounce
              floatLabel
              thin
              labelText={t('volumeFrom')}
              name="volume_min"
              value={searchParams.get('volume_min') || ''}
              onChange={e => setSearchParams({ volume_min: e.target.value, page: 1 })}
              type="number"
            />
            <Debounce
              floatLabel
              thin
              labelText={t('volumeTo')}
              name="volume_max"
              value={searchParams.get('volume_max') || ''}
              onChange={e => setSearchParams({ volume_max: e.target.value, page: 1 })}
              type="number"
            />
          </div>
          <SelectCustom
            name="actuals"
            labelText={t('actuals')}
            {...selectConf}
            options={actualsOptions}
            onChange={onSelectChange}
            value={setSelectValue(actualsOptions, 'actuals', true)}
          />
        </div>
        <div>
          <SelectCustom
            options={warehouseInWayFrom || []}
            onChange={onSelectChange}
            value={setSelectValue(warehouseInWayFrom, 'from_warehouse')}
            name="from_warehouse"
            labelText={t('inWayFromWarehouse')}
            style={{ gridColumn: 'span 3' }}
            {...selectConf}
          />
          <SelectCustom
            name="to_warehouse"
            options={warehouseInWayTo || []}
            value={setSelectValue(warehouseInWayTo, 'to_warehouse')}
            onChange={onSelectChange}
            labelText={t('inWayToWarehouse')}
            style={{ gridColumn: 'span 3' }}
            {...selectConf}
          />
        </div>
      </div>
      <div>
        <Icon
          iconId="cleaner"
          clickable
          color="#DF3B57"
          onClick={() => {
            setSearchParams({ tab: 'containers', page: 1, page_size: 25 }, true);
          }}
        />
      </div>
    </div>
  );
});

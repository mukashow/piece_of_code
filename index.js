import React, { useEffect, useState } from 'react';
import s from '@pages/Warehouse/index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Table } from '@/components';
import { ErrorBoundaryHoc } from '@components/ErrorBoundary';
import { TableFilter, TableRow } from './components';
import {
  fetchContainerCustomType,
  fetchContainerInWayFromWarehouses,
  fetchContainerInWayToWarehouses,
  fetchContainerOrders,
  fetchContainerOwnershipType,
  fetchWarehousesForReturn,
  fetchContainerStates,
  fetchContainerStatuses,
  fetchWarehouseList,
  fetchContainers,
} from '@actions/index';
import { declOfNum } from '@/helpers';

const HEAD_ROW = [
  'containerNumber',
  'arrivalDate',
  'ownershipType',
  'owner',
  'returnDate',
  'returnWarehouse',
  'customsType',
  'weight',
  'volume',
  'state',
  'status',
  'tableDocAction',
];

const containerSynopsis = ['контайнер', 'контейнера', 'контейнеров'];

export const Containers = ErrorBoundaryHoc(() => {
  const containers = useSelector(state => state.container.containers);
  const roleId = useSelector(state => state.auth.user?.role_id);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { warehouseId } = useParams();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(fetchContainerOwnershipType());
    dispatch(fetchWarehousesForReturn());
    dispatch(fetchContainerCustomType());
    dispatch(fetchContainerStates());
    dispatch(fetchContainerStatuses());
    dispatch(fetchContainerInWayFromWarehouses());
    dispatch(fetchContainerInWayToWarehouses());
    dispatch(fetchContainerOrders());
    if (roleId === 5) {
      dispatch(fetchWarehouseList());
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchContainers(searchParams)).finally(() => setLoading(false));
  }, [searchParams, pathname]);

  return (
    <Box>
      <Table
        loading={loading}
        className={s.actTable}
        row={containers?.containers_list}
        currentPage={searchParams.get('page')}
        resultsCount={containers?.page?.results_count}
        headRow={HEAD_ROW}
        filter={<TableFilter />}
        emptyMessage="emptyContainersList"
        RowComponent={TableRow}
        rowProps={{ roleId, warehouseId }}
        maxHeight={window.innerHeight - 100}
        footerTags={[
          `1 ${
            i18n.language.match(/ru|ru-RU/) ? declOfNum(1, containerSynopsis) : t('containers')
          }`,
          containers?.total?.weight + ` ${t('weightKg')}`,
          containers?.total?.volume + ` ${t('cubicMeter')}`,
        ]}
      />
    </Box>
  );
});

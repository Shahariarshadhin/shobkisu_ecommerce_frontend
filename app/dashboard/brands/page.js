'use client'
import { Provider } from 'react-redux'

import BrandManagement from "../../../components/Dashboard/BrandManagement/BrandManagementContainer";
import { store } from '../../../redux/store';

const Page = () => {
  return (
    <Provider store={store}>
      <BrandManagement />
    </Provider>
  );
};

export default Page;
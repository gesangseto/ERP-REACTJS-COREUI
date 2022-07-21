import { Button, Card, Form, Input, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  matchRoutes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { XFormApproval } from "../../../component";
import { canApprove } from "../../../helper/utils";
// import { updateDepartment } from "../../../resource/administrator/department";
import {
  getDepartment,
  insertDepartment,
  updateDepartment,
} from "../../../resource";
import routes from "../../../routes";

const FormDepart = () => {
  let { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [{ route }] = matchRoutes(routes, location);
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [approval, setApproval] = useState({});
  const [formData, setFormData] = useState({
    user_department_id: "",
    user_department_name: "",
    user_department_code: "",
  });

  useEffect(() => {
    (async function () {
      if (id) {
        loadFormData(id);
      }
    })();
  }, []);

  useEffect(() => {
    form.current.resetFields();
    if (formData.hasOwnProperty("approval")) {
      let app = formData.approval;
      if (app) {
        if (!canApprove(app)) {
          delete app.approval_flow_id;
        }
        setApproval({ ...app });
      }
    }
  }, [formData]);

  const loadFormData = async (id) => {
    let _data = await getDepartment({ user_department_id: id });
    _data = _data.data[0];
    setFormData({ ..._data });
  };

  const saveFormData = async (param = Object) => {
    let _data;
    if (id) {
      param.user_department_id = id;
      _data = await updateDepartment(param);
    } else {
      _data = await insertDepartment(param);
    }
    if (_data) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.status = e.status ? 1 : 0;
    saveFormData(e);
  };
  return (
    <Card title={route.name} style={{ textTransform: "capitalize" }}>
      <Form
        ref={form}
        defaultValue={formData}
        onFinish={(e) => handleSubmit(e)}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: "default",
        }}
        size={"default"}
      >
        <Form.Item
          initialValue={formData.user_department_code}
          label="Department Code"
          name="user_department_code"
          rules={[
            { required: true, message: "Please input your Department Code!" },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.user_department_name}
          label="Department Name"
          name="user_department_name"
          rules={[
            {
              required: true,
              message: "Please input your Department Name!",
            },
          ]}
        >
          <Input disabled={type == "read"} />
        </Form.Item>
        <Form.Item
          initialValue={formData.status}
          label="Status"
          valuePropName="checked"
          name="status"
        >
          <Switch disabled={type == "read"} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            disabled={type == "read"}
          >
            Save
          </Button>
          &nbsp;
          <Button type="danger" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
      {Object.keys(approval).length > 0 ? (
        <XFormApproval item={approval} />
      ) : null}
    </Card>
  );
};
export default FormDepart;

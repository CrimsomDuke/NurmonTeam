import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import { type AbilityDataDTO, type ItemDataDTO } from "../../types/types";
import SearchableComboBox from "../shared/SearcheableComboBox";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";


type MemberItemAbilityComponentProps = {
    teamMemberId: number,
    itemId: number,
    selectedAbilityId: number
}

const MemberItemAbilityComponent = (props: MemberItemAbilityComponentProps) => {

    const [selectedAbilityData, setSelectedAbilityData] = useState<AbilityDataDTO | null>(null);
    const [selectedItemData, setSelectedItemData] = useState<ItemDataDTO | null>(null);
    const [showModalItem, setShowModalItem] = useState(false);

    const handleModalItemClose = () => setShowModalItem(false);
    const handleModalItemShow = () => setShowModalItem(true);

    const fetchAbilityData = async (abilityId: number) => {
        const response = await fetch(`${global_vars.API_URL}/abilities/${abilityId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        if (response.ok) {
            setSelectedAbilityData(data);
        } else {
            console.error("Error fetching ability data:", data);
            alert("Error fetching ability data: " + (data.data || data.error));
        }
        return response.json();
    }

    const fetchItemData = async (itemId: number) => {
        const response = await fetch(`${global_vars.API_URL}/items/${itemId}`);
        const data = await response.json();
        if (response.ok) {
            setSelectedItemData(data);
        } else {
            console.error("Error fetching item data:", data);
            alert("Error fetching item data: " + (data.data || data.error));
        }
    }

    useEffect(() => {
        if (props.selectedAbilityId) {
            fetchAbilityData(props.selectedAbilityId);
        }

        if (props.itemId) {
            fetchItemData(props.itemId);
        }
    }, [props.teamMemberId, props.itemId, props.selectedAbilityId]);


    return (
        <>
            <div className="d-flex align-items-center">
                <Row className="align-items-center mb-3">
                    <Col xs="auto">
                        <h5>Item</h5>
                        {selectedItemData?.image_path && (
                            <div className="d-flex align-items-center gap-3">
                                <img
                                    src={`${global_vars.UPLOADS_URL}/item/${selectedItemData.image_path}`}
                                    alt={selectedItemData.name}
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <div>
                                    <div className="fw-semibold">{selectedItemData.name}</div>
                                </div>
                            </div>
                        )}
                                                            <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="mt-2"
                                        onClick={handleModalItemShow}
                                        style={{ fontSize: '20px' }}
                                    >
                                        <PencilFill className="me-1"/>
                                        Edit
                                    </Button>
                    </Col>
                </Row>
            </div>

            <Modal show={showModalItem} onHide={handleModalItemClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecte the Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SearchableComboBox<ItemDataDTO>
                        endpoint={`${global_vars.API_URL}/items`}
                        textField="name"
                        valueField="id"
                        folder_name="item"
                        image_field="image_path"
                        placeholder="Select Item"
                        onSelect={(item) => {
                            setSelectedItemData(item);
                        }}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MemberItemAbilityComponent;
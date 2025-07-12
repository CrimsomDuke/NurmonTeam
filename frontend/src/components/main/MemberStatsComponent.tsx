import { Form, ProgressBar, Table } from "react-bootstrap";
import type { NatureDataDTO, TeamMemberDataDTO } from "../../types/types";
import { useEffect, useState } from "react";
import global_vars from "../../../global/global_vars";
import { useAuth } from "../../hooks/useAuth";
import ExtendedCustomComboBox from "../shared/ExtendedCustomComboBox";
import { calculateStatsFormularForHp, calculateStatsFormularForOtherStats } from '../../../global/utils';


interface MemberStatsComponentProps {
    memberObject: TeamMemberDataDTO;
    onChange?: () => void;
}

const MemberStatsComponent = (props: MemberStatsComponentProps) => {

    const { getToken } = useAuth();

    const [memberObject, setMemberObject] = useState<TeamMemberDataDTO>(props.memberObject);

    const [memberHpEV, setMemberHpEV] = useState<number>(0);
    const [memberAttackEV, setMemberAttackEV] = useState<number>(0);
    const [memberDefenseEV, setMemberDefenseEV] = useState<number>(0);
    const [memberSpecialAttackEV, setMemberSpecialAttackEV] = useState<number>(0);
    const [memberSpecialDefenseEV, setMemberSpecialDefenseEV] = useState<number>(0);
    const [memberSpeedEV, setMemberSpeedEV] = useState<number>(0);

    const [memberHpIV, setMemberHpIV] = useState<number>(0);
    const [memberAttackIV, setMemberAttackIV] = useState<number>(0);
    const [memberDefenseIV, setMemberDefenseIV] = useState<number>(0);
    const [memberSpecialAttackIV, setMemberSpecialAttackIV] = useState<number>(0);
    const [memberSpecialDefenseIV, setMemberSpecialDefenseIV] = useState<number>(0);
    const [memberSpeedIV, setMemberSpeedIV] = useState<number>(0);


    const [natures, setNatures] = useState<NatureDataDTO[]>([]);
    const [selectedNatureId, setSelectedNatureId] = useState<number>(0);

    useEffect(() => {
        fetchNatures();
    }, [])

    useEffect(() => {
        if (props.memberObject) {
            setMemberObject(props.memberObject);

            setMemberHpEV(props.memberObject.hp_ev);
            setMemberAttackEV(props.memberObject.attack_ev);
            setMemberDefenseEV(props.memberObject.def_ev);
            setMemberSpecialAttackEV(props.memberObject.special_attack_ev);
            setMemberSpecialDefenseEV(props.memberObject.special_def_ev);
            setMemberSpeedEV(props.memberObject.speed_ev);

            setMemberHpIV(props.memberObject.hp_iv);
            setMemberAttackIV(props.memberObject.attack_iv);
            setMemberDefenseIV(props.memberObject.def_iv);
            setMemberSpecialAttackIV(props.memberObject.special_attack_iv);
            setMemberSpecialDefenseIV(props.memberObject.special_def_iv);
            setMemberSpeedIV(props.memberObject.speed_iv);

            setSelectedNatureId(props.memberObject.nature_id || 0);
        }
    }, [props.memberObject])

    const totalEVs = memberHpEV + memberAttackEV + memberDefenseEV +
        memberSpecialAttackEV + memberSpecialDefenseEV + memberSpeedEV;

    const getSelectedNature = () => {
        return natures.find(nature => nature.id === selectedNatureId) || null;
    }

    const calculateTotalHP = () => {
        console.log(getSelectedNature())
        return calculateStatsFormularForHp(memberObject.nurmon.hp, 100, memberHpIV, memberHpEV);
    }

    const calculateTotalAttack = () => {
        return calculateStatsFormularForOtherStats(memberObject.nurmon.attack, 100, memberAttackIV, memberAttackEV,
            getSelectedNature() ? getSelectedNature()?.attack_multiplier as number : 1);
    }

    const calculateTotalDefense = () => {
        return calculateStatsFormularForOtherStats(memberObject.nurmon.def, 100, memberDefenseIV, memberDefenseEV,
            getSelectedNature() ? getSelectedNature()?.def_multiplier as number : 1);
    }

    const calculateTotalSpecialAttack = () => {
        return calculateStatsFormularForOtherStats(memberObject.nurmon.special_attack, 100, memberSpecialAttackIV, memberSpecialAttackEV,
            getSelectedNature() ? getSelectedNature()?.special_attack_multiplier as number : 1);
    }

    const calculateTotalSpecialDefense = () => {
        return calculateStatsFormularForOtherStats(memberObject.nurmon.special_def, 100, memberSpecialDefenseIV, memberSpecialDefenseEV,
            getSelectedNature() ? getSelectedNature()?.special_def_multiplier as number : 1);
    }

    const calculateTotalSpeed = () => {
        return calculateStatsFormularForOtherStats(memberObject.nurmon.speed, 100, memberSpeedIV, memberSpeedEV,
            getSelectedNature() ? getSelectedNature()?.speed_multiplier as number : 1);
    }

    // PA EVITAR QUE LOS USUARIOS NDE MIERDA PONGA NUMORES MAYORES A LOS PERMITIDOS
    useEffect(() => {
        if (memberAttackEV < 0) setMemberAttackEV(0);
        if (memberDefenseEV < 0) setMemberDefenseEV(0);
        if (memberHpEV < 0) setMemberHpEV(0);
        if (memberSpecialAttackEV < 0) setMemberSpecialAttackEV(0);
        if (memberSpecialDefenseEV < 0) setMemberSpecialDefenseEV(0);
        if (memberSpeedEV < 0) setMemberSpeedEV(0);
        if (memberAttackIV < 0) setMemberAttackIV(0);
        if (memberDefenseIV < 0) setMemberDefenseIV(0);
        if (memberHpIV < 0) setMemberHpIV(0);
        if (memberSpecialAttackIV < 0) setMemberSpecialAttackIV(0);
        if (memberSpecialDefenseIV < 0) setMemberSpecialDefenseIV(0);
        if (memberSpeedIV < 0) setMemberSpeedIV(0);
        if (memberAttackEV > 256) setMemberAttackEV(256);
        if (memberDefenseEV > 256) setMemberDefenseEV(256);
        if (memberHpEV > 256) setMemberHpEV(256);
        if (memberSpecialAttackEV > 256) setMemberSpecialAttackEV(256);
        if (memberSpecialDefenseEV > 256) setMemberSpecialDefenseEV(256);
        if (memberSpeedEV > 256) setMemberSpeedEV(256);
        if (memberAttackIV > 31) setMemberAttackIV(31);
        if (memberDefenseIV > 31) setMemberDefenseIV(31);
        if (memberHpIV > 31) setMemberHpIV(31);
        if (memberSpecialAttackIV > 31) setMemberSpecialAttackIV(31);
        if (memberSpecialDefenseIV > 31) setMemberSpecialDefenseIV(31);
        if (memberSpeedIV > 31) setMemberSpeedIV(31);
    }, [memberAttackEV, memberAttackIV, memberDefenseEV, memberDefenseIV, memberHpEV, memberHpIV,
        memberSpecialAttackEV, memberSpecialAttackIV, memberSpecialDefenseEV, memberSpecialDefenseIV,
        memberSpeedEV, memberSpeedIV, selectedNatureId]);

    const getProgressColor = (value: number, max: number) => {
        const percentage = (value / max) * 100;
        if (percentage < 30) return 'danger';
        if (percentage < 60) return 'warning';
        if (percentage < 80) return 'info';
        return 'success';
    };

    const fetchNatures = async () => {
        try {
            const response = await fetch(`${global_vars.API_URL}/natures`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setNatures(data);
            } else {
                console.error("Failed to fetch natures:", data);
                alert("Failed to fetch natures. Please try again later.");
            }

        } catch (err) {
            console.error("Error fetching natures:", err);
            alert("Failed to fetch natures. Please try again later. ");
        }
    }

    const handleUpdateMemberStats = async () => {

        if (memberHpEV + memberAttackEV + memberDefenseEV + memberSpecialAttackEV +
            memberSpecialDefenseEV + memberSpeedEV > 508) {
            alert("The total EVs cannot exceed 508. Please adjust the values.");
            return;
        }

        const body = {
            team_id: memberObject.team_id,
            nurmon_id: memberObject.nurmon_id,
            hp_ev: memberHpEV,
            attack_ev: memberAttackEV,
            def_ev: memberDefenseEV,
            special_attack_ev: memberSpecialAttackEV,
            special_def_ev: memberSpecialDefenseEV,
            speed_ev: memberSpeedEV,
            hp_iv: memberHpIV,
            attack_iv: memberAttackIV,
            def_iv: memberDefenseIV,
            special_attack_iv: memberSpecialAttackIV,
            special_def_iv: memberSpecialDefenseIV,
            speed_iv: memberSpeedIV,
            nature_id: selectedNatureId ? selectedNatureId : null
        }

        try {
            const response = await fetch(`${global_vars.API_URL}/team_members/update/${memberObject.id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify(body)
            })

            const data = await response.json();
            if (response.ok) {
                console.log("Member stats updated successfully:", data);
                props.onChange?.();
                alert("Member stats updated successfully!");
            } else {
                console.error("Failed to update member stats:", data);
                alert("Failed to update member stats. Please try again later.");
            }
        } catch (err) {
            console.error("Error updating member stats:", err);
            alert("Failed to update member stats. Please try again later. ");
        }
    }

    return (


        <>
            <div className="stats-container">
                <div className="card border-0 shadow-lg">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Stats Configuration</h4>
                    </div>

                    <div className="card-body">
                        {memberObject && (
                            <div className="table-responsive">
                                <Table bordered hover className="mb-4">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th className="text-center">Stat</th>
                                            <th className="text-center">Base</th>
                                            <th className="text-center">EVs</th>
                                            <th className="text-center">IVs</th>
                                            <th className="text-center" style={{ minWidth: "150px" }}>Progress</th>
                                            <th className="text-center">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center fw-bold">HP</td>
                                            <td className="text-center">{memberObject.nurmon.hp}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberHpEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberHpEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberHpIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberHpIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalHP()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalHP(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalHP()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalHP()}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center fw-bold">Attack</td>
                                            <td className="text-center">{memberObject.nurmon.attack}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberAttackEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberAttackEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberAttackIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberAttackIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalAttack()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalAttack(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalAttack()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalAttack()}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center fw-bold">Defense</td>
                                            <td className="text-center">{memberObject.nurmon.def}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberDefenseEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberDefenseEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberDefenseIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberDefenseIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalDefense()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalDefense(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalDefense()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalDefense()}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center fw-bold">Sp. Atk</td>
                                            <td className="text-center">{memberObject.nurmon.special_attack}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberSpecialAttackEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberSpecialAttackEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberSpecialAttackIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberSpecialAttackIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalSpecialAttack()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalSpecialAttack(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalSpecialAttack()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalSpecialAttack()}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center fw-bold">Sp. Def</td>
                                            <td className="text-center">{memberObject.nurmon.special_def}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberSpecialDefenseEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberSpecialDefenseEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberSpecialDefenseIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberSpecialDefenseIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalSpecialDefense()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalSpecialDefense(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalSpecialDefense()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalSpecialDefense()}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-center fw-bold">Speed</td>
                                            <td className="text-center">{memberObject.nurmon.speed}</td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={256}
                                                    value={memberSpeedEV}
                                                    size="sm"
                                                    className="text-center ev-input"
                                                    onChange={(e) => setMemberSpeedEV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    max={31}
                                                    value={memberSpeedIV}
                                                    size="sm"
                                                    className="text-center iv-input"
                                                    onChange={(e) => setMemberSpeedIV(parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <ProgressBar
                                                    now={calculateTotalSpeed()}
                                                    max={global_vars.MAX_STANDARD}
                                                    variant={getProgressColor(calculateTotalSpeed(), global_vars.MAX_STANDARD)}
                                                    className="stat-progress"
                                                    label={`${calculateTotalSpeed()}`}
                                                />
                                            </td>
                                            <td className="text-center fw-bold">{calculateTotalSpeed()}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        <div className="nature-selection mb-4">
                            <h5 className="mb-3">Nature</h5>
                            <ExtendedCustomComboBox<NatureDataDTO>
                                dataSource={natures}
                                textSelector={(nature) =>
                                    `${nature.name} (${nature.buff_stat ? nature.buff_stat + "+" : ""} / ${nature.nerf_stat ? nature.nerf_stat + "-" : ""})`
                                }
                                valueSelector={(item) => item.id}
                                selectedValue={selectedNatureId}
                                onChange={(id) => setSelectedNatureId(parseInt(id as string))}
                            />
                        </div>

                        <div className="text-center">
                            <button
                                className="btn btn-primary btn-lg px-4"
                                onClick={handleUpdateMemberStats}
                                disabled={totalEVs > 508}
                            >
                                <i className="bi bi-save me-2"></i>
                                Save Changes
                            </button>
                            {totalEVs > 508 && (
                                <div className="text-danger mt-2">
                                    Total EVs cannot exceed 508
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .stats-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .card {
                    border-radius: 12px;
                    overflow: hidden;
                }
                
                .card-header {
                    padding: 1.25rem 1.5rem;
                }
                
                .ev-input, .iv-input {
                    max-width: 80px;
                    margin: 0 auto;
                }
                
                .stat-progress {
                    height: 24px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: bold;
                }
                
                .total-ev-progress {
                    height: 10px;
                    border-radius: 5px;
                }
                
                .nature-combobox {
                    max-width: 400px;
                    margin: 0 auto;
                }
                
                .table th {
                    background-color: #f8f9fa;
                    vertical-align: middle;
                }
                
                @media (max-width: 768px) {
                    .table-responsive {
                        overflow-x: auto;
                    }
                    
                    .ev-input, .iv-input {
                        max-width: 60px;
                    }
                }
            `}</style>
        </>

    )
}

export default MemberStatsComponent;
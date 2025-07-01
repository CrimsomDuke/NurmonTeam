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

    const getSelectedNature = () => {
        return natures.find(nature => nature.id === selectedNatureId) || null;
    }

    const calculateTotalHP = () => {
        console.log(getSelectedNature())
        return calculateStatsFormularForHp(memberObject.nurmon.hp, 100, memberHpEV, memberHpIV);
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

        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h4 className="mb-4">Stats</h4>
                {memberObject && (
                    <Table striped hover responsive className="align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>Stat</th>
                                <th>Base</th>
                                <th>EVs</th>
                                <th>IVs</th>
                                <th style={{ minWidth: "120px" }}>Bar</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { label: "HP", base: memberObject.nurmon.hp, EV: memberHpEV, setEV: setMemberHpEV, IV: memberHpIV, setIV: setMemberHpIV, calc: calculateTotalHP },
                                { label: "Attack", base: memberObject.nurmon.attack, EV: memberAttackEV, setEV: setMemberAttackEV, IV: memberAttackIV, setIV: setMemberAttackIV, calc: calculateTotalAttack },
                                { label: "Defense", base: memberObject.nurmon.def, EV: memberDefenseEV, setEV: setMemberDefenseEV, IV: memberDefenseIV, setIV: setMemberDefenseIV, calc: calculateTotalDefense },
                                { label: "Sp. Atk", base: memberObject.nurmon.special_attack, EV: memberSpecialAttackEV, setEV: setMemberSpecialAttackEV, IV: memberSpecialAttackIV, setIV: setMemberSpecialAttackIV, calc: calculateTotalSpecialAttack },
                                { label: "Sp. Def", base: memberObject.nurmon.special_def, EV: memberSpecialDefenseEV, setEV: setMemberSpecialDefenseEV, IV: memberSpecialDefenseIV, setIV: setMemberSpecialDefenseIV, calc: calculateTotalSpecialDefense },
                                { label: "Speed", base: memberObject.nurmon.speed, EV: memberSpeedEV, setEV: setMemberSpeedEV, IV: memberSpeedIV, setIV: setMemberSpeedIV, calc: calculateTotalSpeed },
                            ].map((stat, i) => (
                                <tr key={i}>
                                    <td className="text-capitalize">{stat.label}</td>
                                    <td>{stat.base}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            max={256}
                                            value={stat.EV}
                                            size="sm"
                                            onChange={(e) => stat.setEV(parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            max={31}
                                            value={stat.IV}
                                            size="sm"
                                            onChange={(e) => stat.setIV(parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td>
                                        <ProgressBar now={stat.calc()} max={global_vars.MAX_STANDARD} />
                                    </td>
                                    <td><strong>{stat.calc()}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <hr />

                <div className="mb-3">
                    <h5>Nature</h5>
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
                    <button className="btn btn-outline-success" onClick={handleUpdateMemberStats}>
                        Save Stats Changes
                    </button>
                </div>
            </div>
        </div>


    )
}

export default MemberStatsComponent;
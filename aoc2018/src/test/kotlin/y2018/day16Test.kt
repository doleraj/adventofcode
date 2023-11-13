package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File
import java.util.*

class day16Test {

    fun parseFile(name: String): List<String> {
        return File(javaClass.classLoader.getResource(name).toURI()).readLines()
    }

    @Test
    fun testAddr() {
        val registers = arrayOf(1, 2, 3, 4)
        addr(0, 1, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 3) contentEquals registers)
    }

    @Test
    fun testAddi() {
        val registers = arrayOf(1, 2, 3, 4)
        addi(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 3) contentEquals registers)
    }

    @Test
    fun testAddi2() {
        val registers = arrayOf(3, 2, 1, 1)
        addi(2, 1, 2, registers)
        assertTrue(arrayOf(3, 2, 2, 1) contentEquals registers)
    }

    @Test
    fun testMulr() {
        val registers = arrayOf(1, 2, 3, 4)
        mulr(0, 1, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 2) contentEquals registers)
    }

    @Test
    fun testMuli() {
        val registers = arrayOf(1, 2, 3, 4)
        muli(0, 3, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 3) contentEquals registers)
    }

    @Test
    fun testBanr() {
        val registers = arrayOf(1, 2, 3, 4)
        banr(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testBani() {
        val registers = arrayOf(1, 2, 3, 4)
        bani(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)
    }

    @Test
    fun testBorr() {
        val registers = arrayOf(1, 2, 3, 4)
        borr(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 3) contentEquals registers)
    }

    @Test
    fun testBori() {
        val registers = arrayOf(1, 2, 3, 4)
        bori(0, 5, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 5) contentEquals registers)
    }

    @Test
    fun testSetr() {
        val registers = arrayOf(1, 2, 3, 4)
        setr(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testSeti() {
        val registers = arrayOf(1, 2, 3, 4)
        seti(0, 5, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)
    }

    @Test
    fun testGtrr() {
        val registers = arrayOf(1, 2, 3, 4)
        gtrr(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)

        gtrr(1, 0, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testGtri() {
        val registers = arrayOf(1, 2, 3, 4)
        gtri(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)

        gtri(0, 0, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testGtir() {
        val registers = arrayOf(1, 2, 3, 4)
        gtir(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)

        gtir(3, 0, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testEqrr() {
        val registers = arrayOf(1, 2, 3, 3)
        eqrr(2, 3, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)

        eqrr(2, 3, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)
    }

    @Test
    fun testEqri() {
        val registers = arrayOf(1, 2, 3, 4)
        eqri(0, 2, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)

        eqri(0, 1, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 1) contentEquals registers)
    }

    @Test
    fun testEqir() {
        val registers = arrayOf(1, 2, 3, 4)
        eqir(2, 0, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)

        eqir(0, 1, 3, registers)
        assertTrue(arrayOf(1, 2, 3, 0) contentEquals registers)
    }

    @Test
    fun test1() {
        assertEquals(1, day16(parseFile("y2018/day16TestInput.txt")))
    }

    @Test
    fun testActual() {
        assertEquals(588, day16(parseFile("y2018/day16ActualInput.txt")))
    }

    @Test
    fun testActualSecond() {
        assertEquals(-1, day16Second(parseFile("y2018/day16ActualInput2.txt")))
    }
}
